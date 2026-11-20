import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectReportSection, type ProjectReport } from "@/features/events";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const labels = {
  reportLabel: "Project report",
  reportPressHeading: "In the press",
  reportCreditsHeading: "Credits",
  lightboxClose: "Close",
  lightboxPrev: "Previous",
  lightboxNext: "Next",
  lightboxDialog: "Image viewer",
};

const report: ProjectReport = {
  title: "Elephant report",
  intro: "The year in review.",
  keyFigures: [{ label: "Elephants draped", value: "27" }],
  sections: [
    {
      heading: "The story",
      body: [{ _type: "block", _key: "b1", style: "normal", markDefs: [], children: [{ _type: "span", _key: "s1", text: "Body copy", marks: [] }] }],
      pullQuote: "A striking quote",
    },
  ],
  gallery: [{ src: "/g.jpg", alt: "Gallery photo", caption: "Night view", credit: "Photo: Jane" }],
  pressLinks: [{ label: "Local paper", href: "https://example.org/story" }],
  credits: "Made by the team",
};

describe("ProjectReportSection", () => {
  it("renders nothing without a report", () => {
    const { container } = render(<ProjectReportSection labels={labels} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the report has neither a title nor an intro", () => {
    const { container } = render(
      <ProjectReportSection labels={labels} report={{ keyFigures: [{ label: "x", value: "1" }], sections: [], gallery: [], pressLinks: [], credits: "Credits text" }} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the title, intro and every filled part", () => {
    render(<ProjectReportSection labels={labels} report={report} />);
    expect(screen.getByText("Project report")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Elephant report" })).toBeInTheDocument();
    expect(screen.getByText("The year in review.")).toBeInTheDocument();
    expect(screen.getByText("27")).toBeInTheDocument();
    expect(screen.getByText("Elephants draped")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "The story" })).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByText("A striking quote")).toBeInTheDocument();
    expect(screen.getByAltText("Gallery photo")).toBeInTheDocument();
    expect(screen.getByText("Night view")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "In the press" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Local paper" })).toHaveAttribute("href", "https://example.org/story");
    expect(screen.getByRole("heading", { level: 3, name: "Credits" })).toBeInTheDocument();
    expect(screen.getByText("Made by the team")).toBeInTheDocument();
  });

  it("hides parts that are empty and labels that are not configured", () => {
    render(
      <ProjectReportSection
        labels={{}}
        report={{ title: "Only title", keyFigures: [], sections: [], gallery: [], pressLinks: [{ label: "Paper", href: "https://e.org" }], credits: "Who" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Only title" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.queryByText("Project report")).toBeNull();
    // Press links still render without a heading label.
    expect(screen.getByRole("link", { name: "Paper" })).toBeInTheDocument();
  });

  it("renders with an intro but no title", () => {
    render(<ProjectReportSection labels={labels} report={{ intro: "Only intro", keyFigures: [], sections: [], gallery: [], pressLinks: [] }} />);
    expect(screen.getByText("Only intro")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });
});
