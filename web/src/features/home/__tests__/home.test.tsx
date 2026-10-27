import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

import { ArtistRetreats, Hero, MemberNews } from "@/features/home";

describe("Hero", () => {
  it("has exactly one h1 and a membership CTA", () => {
    render(<Hero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Become a member" })).toHaveAttribute(
      "href",
      "https://www.indianamericanartists.org/membership",
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/\S/));
  });
});

describe("MemberNews", () => {
  it("renders an h2 and 8 cards as links", () => {
    render(<MemberNews />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    expect(screen.getAllByRole("link")).toHaveLength(8);
  });
});

describe("ArtistRetreats", () => {
  it("links to both retreat events", () => {
    render(<ArtistRetreats />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /2026 Artist/ })).toHaveAttribute(
      "href",
      "/events/2026-artist-retreat",
    );
    expect(screen.getByRole("link", { name: /2025 Artist/ })).toHaveAttribute(
      "href",
      "/events/2025-artist-retreat",
    );
  });
});
