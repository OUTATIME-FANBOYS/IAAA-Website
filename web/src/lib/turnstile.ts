import { headers } from "next/headers";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Checks the Cloudflare Turnstile token a form posted ("cf-turnstile-response").
 * Turnstile is optional: with no TURNSTILE_SECRET_KEY configured every request passes, so the forms
 * keep working until the keys are added. Once the secret is set, a missing or invalid token is rejected.
 */
export async function verifyTurnstile(data: FormData): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const token = data.get("cf-turnstile-response");
  if (typeof token !== "string" || !token) return false;

  const body = new URLSearchParams({ secret, response: token });
  try {
    const forwarded = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded) body.set("remoteip", forwarded);
  } catch {
    // No request context (e.g. in tests): the client IP is optional.
  }

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body, cache: "no-store" });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed:", (error as Error).message);
    return false;
  }
}
