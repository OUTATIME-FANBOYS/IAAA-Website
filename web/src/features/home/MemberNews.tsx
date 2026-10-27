import { EditorialCard, Section, SectionHeading, SectionLabel } from "@/components/ui";

export interface NewsEntry {
  title: string | null;
  href: string | null;
}

const IAAA = "https://www.indianamericanartists.org/member-bios/members";
const PRAGATI = "https://www.pragatisharma.com/";

const DEFAULT_NEWS: NewsEntry[] = [
  { title: "Geeta Dave’s interview with NPN", href: "https://npnweb.org/an-interview-with-geeta-dave/" },
  { title: "Pragati Sharma at Mohr Gallery", href: PRAGATI },
  { title: "Pragati Sharma at Richmond Art Center", href: PRAGATI },
  { title: "Salma Arastu in the spotlight", href: `${IAAA}/salma-arastu` },
  { title: "East West: My Journey — Nanda Patel", href: "https://galleryat808.com/portfolio/exhibition-pieces/" },
  { title: "Usha Shukla at Fox Chase Cancer Center", href: `${IAAA}/usha-shukla` },
  {
    title: "The healing power of art — Sujata Tibrewala",
    href: "https://www.healing-power-of-art.org/world-changer-sujata-tibrewala-artist-and-founder-of-iaaa/",
  },
  { title: "Geeta Dave: Replenish 2026 resident", href: `${IAAA}/geeta-dave` },
];

export interface MemberNewsProps {
  eyebrow?: string | null;
  heading?: string | null;
  items?: NewsEntry[] | null;
}

export function MemberNews({ eyebrow, heading, items }: MemberNewsProps = {}) {
  const news = items && items.length > 0 ? items : DEFAULT_NEWS;
  return (
    <Section divider tone="blossom" innerClassName="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        <SectionLabel>{eyebrow || "From our community"}</SectionLabel>
        <SectionHeading>{heading || "Member news & creative milestones"}</SectionHeading>
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
        {news.map((item, i) => (
          <li key={i}>
            <EditorialCard href={item.href || "#"} title={item.title} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
