import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { MembershipBand, SiteFooter, SiteHeader } from "@/features/site-shell";

const links = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];

describe("SiteHeader", () => {
  it("renders the site name linking home and the CMS nav links", () => {
    render(<SiteHeader siteName="IAAA" links={links} />);
    expect(screen.getByRole("link", { name: "IAAA" })).toHaveAttribute("href", "/");
    const nav = screen.getByRole("navigation", { name: "IAAA" });
    expect(within(nav).getAllByRole("link").map((l) => l.textContent)).toEqual(["About", "Events"]);
  });

  it("shows the members menu only when its label is configured", () => {
    const { rerender } = render(<SiteHeader siteName="IAAA" links={links} />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<SiteHeader siteName="IAAA" links={links} membersMenu={{ label: "Members", all: "Everyone" }} />);
    expect(screen.getByRole("button", { name: /Members/ })).toBeInTheDocument();
  });

  it("renders a hamburger menu with the CMS labels that opens the links and member links", async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        siteName="IAAA"
        links={links}
        founders={[{ name: "Ada Founder", slug: "ada" }]}
        membersMenu={{ label: "Members", all: "Everyone", founders: "Founders" }}
        menuLabels={{ open: "Open menu", close: "Close menu" }}
      />,
    );
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    await user.click(button);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2); // desktop nav + mobile panel
    expect(screen.getByRole("link", { name: "Ada Founder" })).toHaveAttribute("href", "/members/ada");
    await user.click(screen.getByRole("link", { name: "Ada Founder" }));
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("has no hamburger without menu labels", () => {
    render(<SiteHeader siteName="IAAA" links={links} />);
    expect(screen.queryByRole("button", { name: /menu/i })).toBeNull();
  });

  it("uses the uploaded logos when provided", () => {
    const { container } = render(
      <SiteHeader siteName="IAAA" links={[]} logo={{ src: "/dark.png", alt: "" }} logoLight={{ src: "/light.png", alt: "" }} />,
    );
    const srcs = Array.from(container.querySelectorAll("img")).map((i) => i.getAttribute("src") ?? "");
    expect(srcs.some((s) => s.includes("dark.png"))).toBe(true);
    expect(srcs.some((s) => s.includes("light.png"))).toBe(true);
  });
});

describe("MembershipBand", () => {
  it("renders CMS content with its CTA", () => {
    render(<MembershipBand heading="H" body="B" ctaLabel="Go" ctaHref="/go" />);
    expect(screen.getByRole("heading", { level: 2, name: "H" })).toHaveClass("text-white");
    expect(screen.getByText("B")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Go" });
    expect(cta).toHaveAttribute("href", "/go");
    expect(cta).toHaveClass("bg-white");
  });

  it("omits the CTA and body when not provided", () => {
    render(<MembershipBand heading="Only heading" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("SiteFooter", () => {
  it("renders CMS content: title, tagline, support link, icon links and caption", () => {
    render(
      <SiteFooter
        title="Title"
        tagline="Tagline"
        supportLink={{ label: "Help", href: "/help" }}
        socials={[
          { label: "Instagram", href: "https://www.instagram.com/x/", icon: "instagram" },
          { label: "Join WhatsApp community", href: "https://chat.whatsapp.com/x", icon: "whatsapp" },
        ]}
        caption="Cap"
        homeLabel="Home"
      />,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Tagline")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("href", "/help");
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/x/");
    expect(screen.getByRole("link", { name: "Join WhatsApp community" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Cap")).toBeInTheDocument();
  });

  it("renders without any optional content", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
