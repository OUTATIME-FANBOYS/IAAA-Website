"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";
import { verifyTurnstile } from "@/lib/turnstile";

export type NewsletterState = {
  status: "idle" | "success" | "exists" | "error";
  /** What was typed, handed back on an error so the form can keep it (React clears forms after an action). */
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP = /^\d{5}(-\d{4})?$/;

const text = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
};

/**
 * Adds a visitor to the Mailchimp audience. Runs on the server only, so the API key never reaches the browser.
 * New contacts are "pending": Mailchimp emails them a confirmation link before they are subscribed.
 */
export async function subscribeToNewsletter(_prev: NewsletterState, data: FormData): Promise<NewsletterState> {
  // Spam trap: real visitors never see this field. Pretend it worked so bots learn nothing.
  if (text(data, "company")) return { status: "success" };

  const email = text(data, "EMAIL").toLowerCase();
  const first = text(data, "FNAME");
  const last = text(data, "LNAME");
  const phone = text(data, "PHONE");
  const zip = text(data, "MMERGE5");
  const fail = (): NewsletterState => ({ status: "error", values: { EMAIL: email, FNAME: first, LNAME: last, PHONE: phone, MMERGE5: zip } });
  if (!(await verifyTurnstile(data))) return fail();
  if (!EMAIL.test(email) || email.length > 254 || !first || !last || !phone || !ZIP.test(zip)) return fail();
  if ([first, last, phone].some((v) => v.length > 100)) return fail();

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const server = apiKey?.split("-")[1];
  if (!apiKey || !listId || !server) {
    console.error("Newsletter sign-up: MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID must be set.");
    return fail();
  }

  try {
    mailchimp.setConfig({ apiKey, server });
    await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "pending",
      merge_fields: { FNAME: first, LNAME: last, PHONE: phone, MMERGE5: zip },
    });
    return { status: "success" };
  } catch (error) {
    const body = (error as { response?: { body?: { title?: string; detail?: string } } }).response?.body;
    if (body?.title === "Member Exists") return { status: "exists" };
    console.error("Newsletter sign-up failed:", body?.title, body?.detail);
    return fail();
  }
}
