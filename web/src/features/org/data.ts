/** Org-structure data access: officers and advisors come from Role documents, programs from Program documents. */
import { safeFetch } from "@/sanity/lib/fetch";
import { PROGRAMS_QUERY, ROLES_QUERY } from "@/sanity/lib/queries";

export interface OrgPerson {
  name: string;
  /** Link to the member bio, e.g. /members/<slug> */
  href: string;
}

export interface OrgRole {
  title: string;
  /** What the role is responsible for. */
  focus?: string;
  person: OrgPerson;
}

export interface OrgProgram {
  title: string;
  description?: string;
  /** What this looks like in practice. */
  example?: string;
}

export interface OrgStructure {
  leadership: OrgRole[];
  advisoryBoard: OrgPerson[];
  standingPrograms: OrgProgram[];
  flexiblePrograms: OrgProgram[];
}

interface CmsRole {
  title?: string | null;
  focus?: string | null;
  group?: "founding" | "leadership" | "advisory" | null;
  person?: { name?: string | null; slug?: string | null } | null;
}

interface CmsProgram {
  name?: string | null;
  kind?: "standing" | "popup" | null;
  description?: string | null;
  example?: string | null;
}

export async function getOrgStructure(): Promise<OrgStructure> {
  const [roles, programs] = await Promise.all([
    safeFetch<CmsRole[]>(ROLES_QUERY, {}, []),
    safeFetch<CmsProgram[]>(PROGRAMS_QUERY, {}, []),
  ]);
  const people = roles.flatMap((r) =>
    r.person?.name && r.person.slug ? [{ role: r, person: { name: r.person.name, href: `/members/${r.person.slug}` } }] : [],
  );
  const toProgram = (p: CmsProgram): OrgProgram[] =>
    p.name
      ? [{ title: p.name, description: p.description ?? undefined, example: p.example ?? undefined }]
      : [];
  return {
    leadership: people
      .filter(({ role }) => role.group !== "advisory" && role.title)
      .map(({ role, person }) => ({ title: role.title as string, focus: role.focus ?? undefined, person })),
    advisoryBoard: people.filter(({ role }) => role.group === "advisory").map(({ person }) => person),
    standingPrograms: programs.filter((p) => p.kind === "standing").flatMap(toProgram),
    flexiblePrograms: programs.filter((p) => p.kind === "popup").flatMap(toProgram),
  };
}
