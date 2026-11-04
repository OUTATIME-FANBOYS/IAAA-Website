import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ groups: ["Fundraising", "Events", "Finance"] as string[], turnstile: true }));
vi.mock("@/sanity/lib/fetch", () => ({ safeFetch: async () => mocks.groups }));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: async () => mocks.turnstile }));

import { submitLead } from "../actions";

const SCRIPT = "https://script.google.com/macros/s/ABC/exec";
const fetchMock = vi.fn();
const idle = { status: "idle" as const };
const form = (over: Record<string, string> = {}) => {
  const data = new FormData();
  const fields = { name: "Ada", email: "Ada@Example.com", group1: "Events", group2: "", note: "Hi", ...over };
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ json: async () => ({ success: true }) });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("CALL_FOR_LEADS_SCRIPT_URL", SCRIPT);
  mocks.turnstile = true;
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("submitLead", () => {
  it("sends the sign-up to the sheet script with a lower-cased email", async () => {
    expect((await submitLead(idle, form())).status).toBe("success");
    const url = new URL(fetchMock.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe(SCRIPT);
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ action: "submit", name: "Ada", email: "ada@example.com", group1: "Events", group2: "" });
  });

  it("requires name, a valid email and a first choice", async () => {
    for (const bad of [{ name: "" }, { email: "nope" }, { group1: "" }] as Record<string, string>[]) {
      const result = await submitLead(idle, form(bad));
      expect(result).toMatchObject({ status: "error", error: "required" });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects the same group twice and groups that are not in the CMS", async () => {
    expect((await submitLead(idle, form({ group2: "Events" }))).error).toBe("sameGroup");
    expect((await submitLead(idle, form({ group1: "Admin" }))).error).toBe("generic");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hands back what was typed on an error", async () => {
    const result = await submitLead(idle, form({ email: "nope" }));
    expect(result.values?.name).toBe("Ada");
  });

  it("fails when the Turnstile check fails, or the sheet is not configured, or the script errors", async () => {
    mocks.turnstile = false;
    expect((await submitLead(idle, form())).error).toBe("generic");
    mocks.turnstile = true;
    vi.stubEnv("CALL_FOR_LEADS_SCRIPT_URL", "https://evil.example.com/x");
    expect((await submitLead(idle, form())).error).toBe("generic");
    vi.stubEnv("CALL_FOR_LEADS_SCRIPT_URL", SCRIPT);
    fetchMock.mockResolvedValue({ json: async () => ({ success: false, error: "boom" }) });
    expect((await submitLead(idle, form())).error).toBe("generic");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("silently accepts bots that fill the spam trap", async () => {
    expect((await submitLead(idle, form({ company: "x" }))).status).toBe("success");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
