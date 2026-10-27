import { Button, Section, SectionHeading } from "@/components/ui";

interface Way {
  title: string;
  body: string;
  cta: string;
  href: string;
}

const WAYS: Way[] = [
  {
    title: "Become a member",
    body: "Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.",
    cta: "Join for $50 / year",
    href: "/membership",
  },
  {
    title: "Donate",
    body: "Your tax-deductible gift supports exhibitions, retreats, and arts education for South Asian artists.",
    cta: "Give today",
    href: "https://app.donorly.ai/en/donate/iaaa?org_name=iaaa",
  },
  {
    title: "Join the community",
    body: "Chat with fellow artists on WhatsApp and get calls for art and event news in our mailing list.",
    cta: "Join WhatsApp",
    href: "https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S",
  },
];

export function WaysToGetInvolved() {
  return (
    <Section divider tone="blossom" innerClassName="flex flex-col items-center gap-10">
      <SectionHeading className="text-center">Ways to get involved</SectionHeading>
      <ul className="grid w-full grid-cols-1 gap-6 tablet:grid-cols-3">
        {WAYS.map((w, i) => (
          <li
            key={w.title}
            className="flex flex-col items-center gap-4 rounded-ds border border-subtle bg-paper p-8 text-center"
          >
            <h3 className="font-serif text-card font-medium text-primary">{w.title}</h3>
            <p className="flex-1 text-meta text-secondary">{w.body}</p>
            <Button href={w.href} variant={i === 0 ? "primary" : "secondary"}>
              {w.cta}
            </Button>
          </li>
        ))}
      </ul>
      <a
        href="http://eepurl.com/iULW-Y"
        target="_blank"
        rel="noopener noreferrer"
        className="text-ui font-semibold text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
      >
        Join our mailing list
      </a>
    </Section>
  );
}
