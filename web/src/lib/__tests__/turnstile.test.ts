import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }) }));

import { verifyTurnstile } from "../turnstile";

const form = (token?: string) => {
  const data = new FormData();
  if (token) data.set("cf-turnstile-response", token);
  return data;
};

describe("verifyTurnstile", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllEnvs());

  it("lets everything through until a secret key is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(await verifyTurnstile(form())).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing token once configured, without calling Cloudflare", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    expect(await verifyTurnstile(form())).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the token, secret and client IP to Cloudflare and accepts a success", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    fetchMock.mockResolvedValue({ json: async () => ({ success: true }) });
    expect(await verifyTurnstile(form("tok"))).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const body = init.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("203.0.113.9");
  });

  it("rejects a failed check and a network error", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    fetchMock.mockResolvedValueOnce({ json: async () => ({ success: false }) });
    expect(await verifyTurnstile(form("bad"))).toBe(false);
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await verifyTurnstile(form("tok"))).toBe(false);
  });
});
