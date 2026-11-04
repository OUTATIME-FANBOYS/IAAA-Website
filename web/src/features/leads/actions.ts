"use server";

import { EMAIL_PATTERN, honeypotTripped, readText } from "@/lib/form";
import { verifyTurnstile } from "@/lib/turnstile";
import { safeFetch } from "@/sanity/lib/fetch";
import { LEAD_GROUP_NAMES_QUERY } from "@/sanity/lib/queries";
import { leadsScriptUrl } from "./data";

export interface LeadsState {
  status: "idle" | "success" | "error";
  /** Which kind of problem, so the form can show the right message. */
  error?: "required" | "sameGroup" | "generic";
  /** What was typed, handed back on an error (React clears forms after an action). */
  values?: Record<string, string>;
}

/** Saves a working-group sign-up to the Google Sheet, after checking the groups exist in the CMS. */
export async function submitLead(_prev: LeadsState, data: FormData): Promise<LeadsState> {
  // Spam trap: real visitors never see this field.
  if (honeypotTripped(data)) return { status: "success" };

  const name = readText(data, "name", 100);
  const email = readText(data, "email", 254).toLowerCase();
  const group1 = readText(data, "group1", 60);
  const group2 = readText(data, "group2", 60);
  const note = readText(data, "note", 1000);
  const values = { name, email, group1, group2, note };
  const fail = (error: NonNullable<LeadsState["error"]>): LeadsState => ({ status: "error", error, values });

  if (!name || !EMAIL_PATTERN.test(email) || !group1) return fail("required");
  if (group2 && group1 === group2) return fail("sameGroup");
  if (!(await verifyTurnstile(data))) return fail("generic");

  const url = leadsScriptUrl();
  const groups = await safeFetch<string[]>(LEAD_GROUP_NAMES_QUERY, {}, []);
  if (!url || !groups.includes(group1) || (group2 && !groups.includes(group2))) {
    if (!url) console.error("Call for leads: CALL_FOR_LEADS_SCRIPT_URL is not set.");
    return fail("generic");
  }

  try {
    const params = new URLSearchParams({ action: "submit", name, email, group1, group2, note });
    const res = await fetch(`${url}?${params}`, { cache: "no-store" });
    const result = (await res.json()) as { success?: boolean; error?: string };
    if (!result.success) throw new Error(result.error ?? "Submission failed");
    return { status: "success" };
  } catch (error) {
    console.error("Call for leads: saving the sign-up failed:", (error as Error).message);
    return fail("generic");
  }
}
