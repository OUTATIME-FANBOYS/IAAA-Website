import { beforeEach, describe, expect, it, vi } from "vitest";
import { safeFetch } from "@/sanity/lib/fetch";
import { getEvent } from "../data";

vi.mock("@/sanity/lib/fetch", () => ({ safeFetch: vi.fn() }));

const image = { asset: { _ref: "image-abc123-800x600-jpg" }, alt: "Elephants under cloth" };

const baseEvent = {
  slug: "migration",
  title: "Great Elephant Migration",
  year: 2025,
  type: "exhibition",
  heroImage: null,
  figures: [],
  recapPhotos: [],
  artworks: [],
  sessions: [],
};

function withReport(report: unknown) {
  vi.mocked(safeFetch).mockResolvedValueOnce({ ...baseEvent, report });
}

describe("event report mapping", () => {
  beforeEach(() => vi.mocked(safeFetch).mockReset());

  it("maps the report fields into plain props", async () => {
    withReport({
      title: "Report",
      intro: "Intro text",
      keyFigures: [{ _key: "a", label: "Elephants draped", value: "27" }],
      sections: [{ heading: "Story", body: [{ _type: "block", children: [{ text: "Hi" }] }], pullQuote: "Quote" }],
      gallery: [{ caption: "Cap", credit: "Photo: Jane", image }],
      pressLinks: [{ label: "Local paper", url: "https://example.org/a" }],
      credits: "Made by the team",
    });
    const e = await getEvent("migration");
    expect(e?.report).toEqual({
      title: "Report",
      intro: "Intro text",
      keyFigures: [{ label: "Elephants draped", value: "27" }],
      sections: [{ heading: "Story", body: [{ _type: "block", children: [{ text: "Hi" }] }], pullQuote: "Quote" }],
      gallery: [
        expect.objectContaining({ alt: "Elephants under cloth", caption: "Cap", credit: "Photo: Jane" }),
      ],
      pressLinks: [{ label: "Local paper", href: "https://example.org/a" }],
      credits: "Made by the team",
    });
    expect(e?.report?.gallery[0].src).toContain("cdn.sanity.io");
  });

  it("leaves the report undefined when there is no report", async () => {
    withReport(null);
    expect((await getEvent("migration"))?.report).toBeUndefined();
  });

  it("leaves the report undefined when it has neither a title nor an intro", async () => {
    withReport({ title: "  ", intro: "", keyFigures: [{ label: "x", value: "1" }], credits: "c" });
    expect((await getEvent("migration"))?.report).toBeUndefined();
  });

  it("drops press links that are not https", async () => {
    withReport({
      title: "Report",
      pressLinks: [
        { label: "Plain", url: "http://example.org" },
        { label: "Script", url: "javascript:alert(1)" },
        { label: "Secure", url: "https://example.org" },
      ],
    });
    const e = await getEvent("migration");
    expect(e?.report?.pressLinks).toEqual([{ label: "Secure", href: "https://example.org" }]);
  });

  it("drops key figures missing a label or value and empty sections", async () => {
    withReport({
      title: "Report",
      keyFigures: [{ label: "Only label", value: null }, { label: "Full", value: "3" }],
      sections: [{ heading: null, body: [], pullQuote: null }],
    });
    const e = await getEvent("migration");
    expect(e?.report?.keyFigures).toEqual([{ label: "Full", value: "3" }]);
    expect(e?.report?.sections).toEqual([]);
  });
});
