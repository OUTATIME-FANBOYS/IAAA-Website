import { describe, expect, it } from "vitest";
import { EMAIL_PATTERN, honeypotTripped, readText } from "../form";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return data;
};

describe("readText", () => {
  it("trims, normalises line endings and caps the length", () => {
    expect(readText(form({ a: "  hi\r\nthere  " }), "a")).toBe("hi\nthere");
    expect(readText(form({ a: "abcdef" }), "a", 3)).toBe("abc");
  });
  it("reads missing and file fields as empty", () => {
    expect(readText(form({}), "a")).toBe("");
    const data = new FormData();
    data.set("a", new File(["x"], "x.txt"));
    expect(readText(data, "a")).toBe("");
  });
});

describe("EMAIL_PATTERN", () => {
  it("accepts plain addresses and rejects obvious junk", () => {
    expect(EMAIL_PATTERN.test("a@b.co")).toBe(true);
    expect(EMAIL_PATTERN.test("a@b")).toBe(false);
    expect(EMAIL_PATTERN.test("a b@c.d")).toBe(false);
  });
});

describe("honeypotTripped", () => {
  it("is true only when the hidden field is filled", () => {
    expect(honeypotTripped(form({ company: "Acme" }))).toBe(true);
    expect(honeypotTripped(form({ company: "" }))).toBe(false);
    expect(honeypotTripped(form({}))).toBe(false);
  });
});
