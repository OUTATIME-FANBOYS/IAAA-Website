import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemberProfile, type Member } from "@/features/members";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const labels = {
  memberBack: "← All members",
  memberNoBio: "No bio yet",
  memberGroupMember: "Members",
  memberGroupLeadership: "Leadership",
};

const member: Member = {
  slug: "ada",
  name: "Ada Artist",
  group: "leadership",
  role: "President",
  medium: "Oil",
  location: "Austin, TX",
  bio: ["First para", "Second para"],
  social: [{ label: "Website", href: "https://example.com" }],
  featuredWork: [],
  events: [],
};

describe("MemberProfile", () => {
  it("shows name and role in the title card, bio paragraphs and social links", () => {
    render(<MemberProfile member={member} labels={labels} />);
    expect(screen.getByRole("heading", { level: 1, name: "Ada Artist" })).toBeInTheDocument();
    expect(screen.getByText("— President")).toBeInTheDocument();
    expect(screen.getByText("First para")).toBeInTheDocument();
    expect(screen.getByText("Second para")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Website" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByRole("link", { name: /All members/ })).toHaveAttribute("href", "/members");
  });

  it("uses a placeholder without a portrait and the portrait when present", () => {
    const { rerender } = render(<MemberProfile member={member} labels={labels} />);
    expect(screen.getByRole("img", { name: /Portrait placeholder/ })).toBeInTheDocument();
    rerender(<MemberProfile member={{ ...member, portraitUrl: "/p.jpg" }} labels={labels} />);
    expect(screen.getByAltText("Portrait of Ada Artist")).toHaveAttribute("src", "/p.jpg");
  });

  it("shows the CMS no-bio text when there is no biography", () => {
    render(<MemberProfile member={{ ...member, bio: [] }} labels={labels} />);
    expect(screen.getByText("No bio yet")).toBeInTheDocument();
  });

  it("omits labels that are not configured", () => {
    render(<MemberProfile member={member} labels={{}} />);
    expect(screen.queryByRole("link", { name: /All members/ })).toBeNull();
  });

  it("falls back to the group label without a role", () => {
    render(<MemberProfile member={{ ...member, role: undefined, group: "member" }} labels={labels} />);
    expect(screen.getByText("— Members")).toBeInTheDocument();
  });
});
