import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_NAV_LINKS, MembershipBand, SiteFooter, SiteHeader } from "@/features/site-shell";

describe("SiteHeader", () => {
  it("renders site name linking home and default nav", () => {
    render(<SiteHeader />);
    const home = screen.getByRole("link", { name: "Indian American Artists Association" });
    expect(home).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(DEFAULT_NAV_LINKS.map((l) => l.label));
    expect(DEFAULT_NAV_LINKS.map((l) => l.label)).toEqual(["About", "Events", "Membership", "Ways to Give"]);
  });

  it("accepts custom siteName and links", () => {
    render(<SiteHeader siteName="Custom" links={[{ label: "Foo", href: "/foo" }]} />);
    expect(screen.getByRole("link", { name: "Custom" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Foo" })).toHaveAttribute("href", "/foo");
    expect(screen.queryByRole("link", { name: "About" })).toBeNull();
  });
});

describe("MembershipBand", () => {
  it("renders default content with CTA to /membership", () => {
    render(<MembershipBand />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Find the community that helps you grow." }),
    ).toHaveClass("text-white");
    const cta = screen.getByRole("link", { name: "Become a member · $50 / year" });
    expect(cta).toHaveAttribute("href", "/membership");
    expect(cta).toHaveClass("bg-white");
  });

  it("accepts overrides", () => {
    render(<MembershipBand heading="H" body="B" ctaLabel="Go" ctaHref="/go" />);
    expect(screen.getByRole("heading", { name: "H" })).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/go");
  });
});

describe("SiteFooter", () => {
  it("renders default content", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Indian American Artists Association")).toBeInTheDocument();
    expect(screen.getByText(/Empower South Asian artists/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Support our community" })).toHaveAttribute("href", "/ways-to-give");
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/artistsiaaa/",
    );
    expect(screen.getByRole("link", { name: "Join WhatsApp community" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Join our mailing list" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Donate" })).toBeInTheDocument();
    expect(screen.getByText(/501\(c\)\(3\)/)).toBeInTheDocument();
  });

  it("accepts custom props", () => {
    render(
      <SiteFooter
        title="T"
        tagline="TL"
        supportLink={{ label: "Help", href: "/help" }}
        socials={[{ label: "One", href: "/one", icon: "mail" }]}
        caption="Cap"
      />,
    );
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");
    expect(screen.getByRole("link", { name: "One" })).toHaveAttribute("href", "/one");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByText("Cap")).toBeInTheDocument();
  });
});
