import { client, isSanityConfigured } from "./client";

/**
 * Fail-soft fetch for server components / generateStaticParams.
 * Returns `fallback` when Sanity is unconfigured, unreachable, or errors.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  fallback: T,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T> {
  if (!isSanityConfigured) return fallback;
  try {
    const result = await client.fetch<T>(query, params, {
      next: { revalidate: options.revalidate ?? 60, tags: options.tags },
    });
    return result ?? fallback;
  } catch (err) {
    console.warn("[sanity] fetch failed:", (err as Error).message);
    return fallback;
  }
}
