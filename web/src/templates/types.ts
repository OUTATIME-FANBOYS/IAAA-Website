import type { PAGE_QUERY_RESULT } from "../../sanity.types";

type Sections = NonNullable<NonNullable<PAGE_QUERY_RESULT>["pageBuilder"]>;
export type PageSection = Sections[number];
export type SectionOf<T extends PageSection["_type"]> = Extract<PageSection, { _type: T }>;

type CtaLike = { label: string | null; href: string | null; style?: "primary" | "secondary" | null } | null | undefined;

/** A CMS call to action, or undefined when label or URL is missing. */
export function cta(c: CtaLike): { label: string; href: string; style?: "primary" | "secondary" } | undefined {
  return c?.label && c.href ? { label: c.label, href: c.href, style: c.style ?? undefined } : undefined;
}
