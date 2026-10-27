import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/lib/events";

const base: Event = {
  slug: "my-event",
  title: "My Event",
  type: "Retreat",
  year: 2026,
  location: "Austin, TX",
  dateLabel: "May 1-3, 2026",
};

describe("EventCard", () => {
  it("links to the event detail page with title and details", () => {
    render(<EventCard event={{ ...base, summary: "A summary" }} />);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "/events/my-event");
    expect(a).toHaveTextContent("My Event");
    expect(a).toHaveTextContent("Retreat");
    expect(a).toHaveTextContent("Austin, TX");
    expect(a).toHaveTextContent("A summary");
  });

  it("omits summary when absent", () => {
    render(<EventCard event={base} />);
    expect(screen.queryByText("A summary")).toBeNull();
  });
});
