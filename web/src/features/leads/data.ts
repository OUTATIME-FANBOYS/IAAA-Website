/** Sign-up counts for the working groups, read from the Google Apps Script behind the sign-up sheet. */

export interface Signups {
  counts: Record<string, number>;
  names: Record<string, string[]>;
}

/** The Apps Script address, from CALL_FOR_LEADS_SCRIPT_URL. Only script.google.com web apps are accepted. */
export function leadsScriptUrl(): string | null {
  const url = process.env.CALL_FOR_LEADS_SCRIPT_URL;
  return url?.startsWith("https://script.google.com/macros/s/") ? url : null;
}

/** Counts and names per group, or null if the sheet is not configured or cannot be reached. */
export async function getSignups(): Promise<Signups | null> {
  const url = leadsScriptUrl();
  if (!url) return null;
  try {
    const res = await fetch(`${url}?action=getData`, { next: { revalidate: 60 } });
    const data = (await res.json()) as { success?: boolean; counts?: Record<string, number>; names?: Record<string, string[]> };
    if (!data.success) return null;
    return { counts: data.counts ?? {}, names: data.names ?? {} };
  } catch {
    return null;
  }
}
