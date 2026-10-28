import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

/** Sanity client for the migration target. DATASET defaults to "staging"; token from `sanity login`. */
export const DATASET = process.env.DATASET ?? "staging";
export const client = createClient({
  projectId: "jh3pdn6m",
  dataset: DATASET,
  apiVersion: "2026-10-02",
  useCdn: false,
  token: JSON.parse(readFileSync(`${homedir()}/.config/sanity/config.json`, "utf8")).authToken,
});
