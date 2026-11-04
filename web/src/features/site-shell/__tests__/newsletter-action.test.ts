import { beforeEach, describe, expect, it, vi } from "vitest";

const { addListMember, setConfig } = vi.hoisted(() => ({ addListMember: vi.fn(), setConfig: vi.fn() }));
vi.mock("@mailchimp/mailchimp_marketing", () => ({ default: { setConfig, lists: { addListMember } } }));

import { subscribeToNewsletter } from "../newsletter-action";

const form = (over: Record<string, string> = {}) => {
  const data = new FormData();
  const fields = { EMAIL: "Ada@Example.com", FNAME: "Ada", LNAME: "Lovelace", PHONE: "+1 555 123 4567", MMERGE5: "10001", ...over };
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};
const idle = { status: "idle" as const };

beforeEach(() => {
  addListMember.mockReset();
  setConfig.mockReset();
  vi.stubEnv("MAILCHIMP_API_KEY", "abc123-us22");
  vi.stubEnv("MAILCHIMP_LIST_ID", "list1");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("subscribeToNewsletter", () => {
  it("adds a pending member with the merge fields, using the data center from the key", async () => {
    addListMember.mockResolvedValue({});
    expect(await subscribeToNewsletter(idle, form())).toEqual({ status: "success" });
    expect(setConfig).toHaveBeenCalledWith({ apiKey: "abc123-us22", server: "us22" });
    expect(addListMember).toHaveBeenCalledWith("list1", {
      email_address: "ada@example.com",
      status: "pending",
      merge_fields: { FNAME: "Ada", LNAME: "Lovelace", PHONE: "+1 555 123 4567", MMERGE5: "10001" },
    });
  });

  it("rejects invalid input without calling Mailchimp, and hands back what was typed", async () => {
    const result = await subscribeToNewsletter(idle, form({ EMAIL: "nope", MMERGE5: "abc" }));
    expect(result.status).toBe("error");
    expect(result.values?.FNAME).toBe("Ada");
    expect(addListMember).not.toHaveBeenCalled();
  });

  it("silently succeeds for bots that fill the spam trap, without calling Mailchimp", async () => {
    expect(await subscribeToNewsletter(idle, form({ company: "Acme" }))).toEqual({ status: "success" });
    expect(addListMember).not.toHaveBeenCalled();
  });

  it("reports an existing member", async () => {
    addListMember.mockRejectedValue({ response: { body: { title: "Member Exists" } } });
    expect((await subscribeToNewsletter(idle, form())).status).toBe("exists");
  });

  it("reports other Mailchimp failures as an error", async () => {
    addListMember.mockRejectedValue({ response: { body: { title: "Invalid Resource", detail: "bad" } } });
    expect((await subscribeToNewsletter(idle, form())).status).toBe("error");
  });

  it("reports an error when the key or list is not configured", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "");
    expect((await subscribeToNewsletter(idle, form())).status).toBe("error");
    expect(addListMember).not.toHaveBeenCalled();
  });
});
