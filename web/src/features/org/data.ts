// Org-structure data access. Swap the body of getOrgStructure() for a Sanity
// fetch later; the OrgStructure shape is the contract the page depends on.

export interface OrgPerson {
  name: string;
  /** Link to the member bio, e.g. /members/<slug> */
  href: string;
}

export interface OrgRole {
  title: string;
  /** What the role is responsible for. */
  focus: string;
  person: OrgPerson;
}

export interface OrgProgram {
  title: string;
  description?: string;
  /** What this looks like in practice. */
  example?: string;
}

export interface OrgStructure {
  mission: string;
  leadership: OrgRole[];
  advisoryBoard: OrgPerson[];
  standingPrograms: OrgProgram[];
  flexiblePrograms: OrgProgram[];
}

const person = (name: string): OrgPerson => ({
  name,
  href: `/members/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
});

export async function getOrgStructure(): Promise<OrgStructure> {
  // TODO(CMS): replace with Sanity query (Role + Program documents).
  return {
    mission: "Empower South Asian artists. Build community. Create impact.",
    leadership: [
      { title: "President", focus: "Vision and external representation", person: person("Sujata Tibrewala") },
      { title: "Treasurer", focus: "Fiscal oversight and budget", person: person("Abhishek Nigam") },
      { title: "Secretary", focus: "Governance and records", person: person("Ramya Thattai") },
      { title: "Board Strategist", focus: "Vision and strategic inputs", person: person("Charmaine Hussain") },
    ],
    advisoryBoard: [
      "Salma Arastu",
      "Usha Shukla",
      "Amita Bhakta",
      "Shailesh Joshi",
      "Biplab Chattopadhyay",
      "Geeta Dave",
    ].map(person),
    standingPrograms: [
      { title: "Membership & Community", description: "Member experience, recruitment, retention and engagement.", example: "Monthly retreats, meetups and online forum" },
      { title: "Communications & PR", description: "Brand, storytelling, media relations and public outreach.", example: "Press mentions, digital campaigns and catalogs" },
      { title: "Programs & Exhibitions", description: "Exhibitions, showcases, curation, venues and artist support.", example: "Bay Area gallery showcases and virtual salons" },
      { title: "Fundraising & Development", description: "Grants, sponsorships, donor relationships and sustainability.", example: "Institutional grants and 501(c)(3) endowments" },
    ],
    flexiblePrograms: [
      { title: "Education & Mentorship" },
      { title: "Events & Productions" },
      { title: "Creative Projects" },
      { title: "Digital & Technology" },
    ],
  };
}
