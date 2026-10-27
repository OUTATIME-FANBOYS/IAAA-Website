import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventBody, EventHero, RelatedEvents } from "@/features/events";
import type { Event } from "@/features/events";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const event: Event = {
  slug: "big-show",
  title: "Big Show",
  type: "Exhibition",
  year: 2026,
  location: "Livermore, CA",
  dateLabel: "October 10 – December 6, 2026",
  startDate: "2026-10-10",
  summary: "A summary",
  description: ["First paragraph", "Second paragraph"],
  figures: [{ src: "/a.jpg", alt: "Artists", caption: "From left to right", credit: "Photo: Someone" }],
  highlight: { title: "Haiku", lines: ["one", "two"] },
};

describe("EventHero", () => {
  it("shows type, title, date and summary in the title card", () => {
    render(<EventHero event={event} />);
    expect(screen.getByRole("heading", { level: 1, name: "Big Show" })).toBeInTheDocument();
    expect(screen.getByText("— Exhibition")).toBeInTheDocument();
    expect(screen.getByText(/October 10/)).toBeInTheDocument();
    expect(screen.getByText("A summary")).toBeInTheDocument();
  });

  it("renders the cover image only when provided", () => {
    const { rerender } = render(<EventHero event={event} />);
    expect(screen.queryByRole("img")).toBeNull();
    rerender(<EventHero event={{ ...event, coverImage: { src: "/c.jpg", alt: "Cover" } }} />);
    expect(screen.getByAltText("Cover")).toBeInTheDocument();
  });
});

describe("EventBody", () => {
  it("renders figures with caption/credit, article, highlight and calendar link", () => {
    render(<EventBody event={event} />);
    expect(screen.getByAltText("Artists")).toBeInTheDocument();
    expect(screen.getByText("From left to right")).toBeInTheDocument();
    expect(screen.getByText("Photo: Someone")).toBeInTheDocument();
    expect(screen.getByText("First paragraph")).toBeInTheDocument();
    expect(screen.getByText("Haiku")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add to calendar" })).toBeInTheDocument();
  });

  it("omits calendar link without a start date", () => {
    render(<EventBody event={{ ...event, startDate: undefined }} />);
    expect(screen.queryByRole("link", { name: "Add to calendar" })).toBeNull();
  });
});

describe("RelatedEvents", () => {
  it("renders nothing when empty and cards otherwise", () => {
    const { container, rerender } = render(<RelatedEvents events={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<RelatedEvents events={[event]} />);
    expect(screen.getByRole("link", { name: /Big Show/ })).toHaveAttribute("href", "/events/big-show");
  });
});
