import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

import { InstagramFeed, MemberNews, WaysToGetInvolved } from "@/features/home";

describe("MemberNews", () => {
  const items = [
    { title: "One", href: "https://a" },
    { title: "Two", href: "https://b" },
  ];

  it("renders the CMS copy and one card link per item", () => {
    render(<MemberNews eyebrow="Eyebrow" heading="Heading" items={items} />);
    expect(screen.getByRole("heading", { level: 2, name: "Heading" })).toBeInTheDocument();
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "One" })).toHaveAttribute("href", "https://a");
  });

  it("renders nothing without items (no built-in content)", () => {
    const { container } = render(<MemberNews heading="Heading" items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("InstagramFeed", () => {
  const posts = [{ id: "1", permalink: "https://ig/p/1", imageUrl: "/a.jpg", caption: "" }];

  it("shows posts with the fallback alt and a profile button", () => {
    render(
      <InstagramFeed heading="IG" profileUrl="https://ig" buttonLabel="Follow" altFallback="Post alt" posts={posts} />,
    );
    expect(screen.getByAltText("Post alt")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Follow" })).toHaveAttribute("href", "https://ig");
  });

  it("shows the blurb when no posts could be loaded", () => {
    render(<InstagramFeed heading="IG" profileUrl="https://ig" blurb="Blurb text" />);
    expect(screen.getByText("Blurb text")).toBeInTheDocument();
  });
});

describe("WaysToGetInvolved", () => {
  it("renders cards with their buttons and the footer link", () => {
    render(
      <WaysToGetInvolved
        heading="Ways"
        cards={[{ title: "Donate", body: "Body", button: { label: "Give", href: "/give", style: "primary" } }]}
        footerLink={{ label: "Newsletter", href: "https://n" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Donate" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Give" })).toHaveAttribute("href", "/give");
    expect(screen.getByRole("link", { name: "Newsletter" })).toBeInTheDocument();
  });
});
