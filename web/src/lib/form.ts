/** Small helpers shared by the server actions that read public forms (newsletter, call for leads, member profile). */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A trimmed text field with Windows line endings normalised. Missing or non-text fields read as "". */
export function readText(data: FormData, key: string, max = Infinity): string {
  const value = data.get(key);
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, max) : "";
}

/** Spam trap: real visitors never see the hidden "company" field, so anything in it is a bot. */
export function honeypotTripped(data: FormData): boolean {
  return Boolean(data.get("company"));
}
