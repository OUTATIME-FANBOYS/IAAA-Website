import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-10-02";

/** False when env vars are missing; data helpers then return empty results. */
export const isSanityConfigured = Boolean(projectId);

export const client = createClient({
  // createClient throws on an empty projectId; use a placeholder so imports never crash.
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: true,
});
