import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./client";

/**
 * Server-only client that can read drafts and write documents (member profiles and invites).
 * SANITY_API_WRITE_TOKEN is an Editor token: keep it out of NEXT_PUBLIC_ variables and client components.
 * Returns null when the token is not configured, so callers can fail closed.
 */
export function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !projectId) return null;
  return createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
}
