// Org-structure data access. Swap the body of getOrgStructure() for a Sanity
// fetch later; the OrgStructure shape is the contract the page depends on.
// All names below are PLACEHOLDERS, not real people.

export interface OrgPerson {
  name: string;
  /** Link to the member bio, e.g. /member-bios/members/<slug> */
  href: string;
}

export interface OrgRole {
  title: string;
  person: OrgPerson;
}

export interface OrgProgram {
  title: string;
  description?: string;
}

export interface OrgStructure {
  mission: string;
  leadership: OrgRole[];
  advisoryBoard: OrgPerson[];
  standingPrograms: OrgProgram[];
  flexiblePrograms: OrgProgram[];
}

const placeholder = (n: number): OrgPerson => ({
  name: `Placeholder Name ${n}`,
  href: "/about/organization",
});

export async function getOrgStructure(): Promise<OrgStructure> {
  // TODO(CMS): replace with Sanity query (Role + Program documents).
  return {
    mission: "Empower South Asian artists. Build community. Create impact.",
    leadership: [
      { title: "President", person: placeholder(1) },
      { title: "Treasurer", person: placeholder(2) },
      { title: "Secretary", person: placeholder(3) },
      { title: "Board Strategist", person: placeholder(4) },
    ],
    advisoryBoard: [5, 6, 7, 8].map(placeholder),
    standingPrograms: [
      { title: "Membership & Community" },
      { title: "Communications & PR" },
      { title: "Programs & Exhibitions" },
      { title: "Fundraising & Development" },
    ],
    flexiblePrograms: [
      { title: "Education & Mentorship" },
      { title: "Events & Productions" },
      { title: "Creative Projects" },
      { title: "Digital & Technology" },
    ],
  };
}
