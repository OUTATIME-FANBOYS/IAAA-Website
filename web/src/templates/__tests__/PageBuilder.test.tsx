import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));
vi.mock("next-sanity", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-sanity")>()),
  PortableText: () => null,
}));

import { PageBuilder } from "@/templates/PageBuilder";
import type { PageSection } from "@/templates/types";

const sections = [
  {
    _key: "h", _type: "hero", eyebrow: "Eyebrow", heading: "Hello", subheading: "Sub", imageUrl: null, imageAlt: null,
    align: "center", chips: ["Chip A"], image: null,
    cta: { label: "Join", href: "/join", style: "primary" }, secondaryLink: { label: "More", href: "/more", style: null },
  },
  {
    _key: "f", _type: "featureGrid", eyebrow: "What", heading: "Cards", intro: "Intro", columns: 3, tone: "blossom",
    features: [{ _key: "1", title: "Card one", description: "Desc", tag: "TAG" }],
  },
  { _key: "q", _type: "quotesSection", tone: "paper", quotes: [{ _key: "1", label: "Mission", text: "Quote text" }] },
  {
    _key: "c", _type: "checklistSection", eyebrow: null, heading: "Who", intro: null, tone: null,
    items: [{ _key: "1", title: "Everyone", description: null }],
  },
  {
    _key: "p", _type: "pricingSection", label: "Annual", title: "Membership", price: "$50", priceUnit: "/ year", body: null,
    notesHeading: "Note", notes: ["Deductible"], cta: { label: "Pay", href: "https://pay", style: null }, tone: "pacific",
  },
  {
    _key: "ch", _type: "channelsSection", eyebrow: null, heading: "Give", tone: null,
    channels: [
      {
        _key: "1", title: "Zelle", body: "Send", note: "Memo", button: null, link: null,
        panel: { heading: "Email", lines: null, monospace: true, copyValue: "a@b.c", copyLabel: "Copy", copiedLabel: "Copied", footnote: null, footnoteLink: null },
      },
    ],
  },
  { _key: "w", _type: "waysSection", heading: "Ways", tone: null, footerLink: null, cards: [{ _key: "1", title: "Donate", body: null, button: { label: "Give", href: "/give", style: "secondary" } }] },
  { _key: "n", _type: "newsSection", eyebrow: null, heading: "News", tone: null, items: [{ _id: "1", title: "Story", url: "https://s", source: null, date: null, image: null }] },
  { _key: "l", _type: "linkListSection", eyebrow: null, heading: "Links", body: null, tone: null, links: [{ _key: "1", label: "Link A", href: "/a", style: null }] },
  { _key: "ct", _type: "ctaSection", heading: "Act now", text: "Text", tone: null, cta: { label: "Go", href: "/go", style: null } },
] as unknown as PageSection[];

describe("PageBuilder", () => {
  it("renders every section type with its CMS text, labels and links", async () => {
    render(<PageBuilder sections={sections} />);
    expect(screen.getByRole("heading", { level: 1, name: "Hello" })).toBeInTheDocument();
    expect(screen.getByText("Chip A")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join" })).toHaveAttribute("href", "/join");
    expect(screen.getByRole("link", { name: "More" })).toHaveAttribute("href", "/more");
    expect(screen.getByRole("heading", { level: 3, name: "Card one" })).toBeInTheDocument();
    expect(screen.getByText("TAG")).toBeInTheDocument();
    expect(screen.getByText("“Quote text”")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Everyone" })).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pay" })).toHaveAttribute("href", "https://pay");
    expect(screen.getByText("a@b.c")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Give" })).toHaveAttribute("href", "/give");
    expect(screen.getByRole("link", { name: "Story" })).toHaveAttribute("href", "https://s");
    expect(screen.getByRole("link", { name: "Link A" })).toHaveAttribute("href", "/a");
    expect(screen.getByRole("heading", { name: "Act now" })).toBeInTheDocument();
  });

  it("renders nothing for an empty page and ignores unknown sections", () => {
    const { container } = render(<PageBuilder sections={[{ _key: "x", _type: "mystery" } as unknown as PageSection]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
