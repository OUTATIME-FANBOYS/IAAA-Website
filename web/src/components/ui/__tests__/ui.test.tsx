import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Button,
  Container,
  EditorialCard,
  EditorialLink,
  Section,
  SectionHeading,
  SectionLabel,
  SmartLink,
} from "@/components/ui";

describe("SmartLink", () => {
  it("renders internal paths as plain anchors without target", () => {
    render(<SmartLink href="/events">Events</SmartLink>);
    const a = screen.getByRole("link", { name: "Events" });
    expect(a).toHaveAttribute("href", "/events");
    expect(a).not.toHaveAttribute("target");
  });

  it("opens third-party URLs in a new tab safely", () => {
    render(<SmartLink href="https://example.com/x">Out</SmartLink>);
    const a = screen.getByRole("link", { name: "Out" });
    expect(a).toHaveAttribute("href", "https://example.com/x");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("treats protocol-relative URLs as external", () => {
    render(<SmartLink href="//example.com">P</SmartLink>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("treats mailto: as external", () => {
    render(<SmartLink href="mailto:a@b.co">Mail</SmartLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "mailto:a@b.co");
  });

  it("does not open own-domain absolute URLs in a new tab", () => {
    render(<SmartLink href="https://www.indianamericanartists.org/about">About</SmartLink>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("forwards extra props", () => {
    render(<SmartLink href="/a" className="x" aria-label="lbl">A</SmartLink>);
    const a = screen.getByRole("link", { name: "lbl" });
    expect(a).toHaveClass("x");
  });
});

describe("Button", () => {
  it("defaults to primary variant", () => {
    render(<Button href="/join">Join</Button>);
    const a = screen.getByRole("link", { name: "Join" });
    expect(a).toHaveAttribute("href", "/join");
    expect(a).toHaveClass("bg-burgundy", "text-white");
  });

  it("supports inverse and secondary variants", () => {
    render(
      <>
        <Button href="/a" variant="inverse">Inv</Button>
        <Button href="/b" variant="secondary">Sec</Button>
      </>,
    );
    expect(screen.getByText("Inv")).toHaveClass("bg-white", "text-burgundy");
    expect(screen.getByText("Sec")).toHaveClass("bg-paper", "border-burgundy");
    expect(screen.getByText("Sec")).not.toHaveClass("bg-burgundy");
  });

  it("merges className and keeps 48px min height", () => {
    render(<Button href="/a" className="extra">X</Button>);
    expect(screen.getByRole("link")).toHaveClass("extra", "min-h-12");
  });

  it("opens external hrefs in a new tab", () => {
    render(<Button href="https://example.com">Ext</Button>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });
});

describe("EditorialLink", () => {
  it("renders an underlined burgundy link", () => {
    render(<EditorialLink href="/x">Read</EditorialLink>);
    const a = screen.getByRole("link", { name: "Read" });
    expect(a).toHaveAttribute("href", "/x");
    expect(a).toHaveClass("underline", "text-burgundy");
  });
});

describe("EditorialCard", () => {
  it("renders title and optional children inside one link", () => {
    render(<EditorialCard href="/m/1" title="Title">Caption</EditorialCard>);
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "/m/1");
    expect(within(a).getByText("Title")).toBeInTheDocument();
    expect(within(a).getByText("Caption")).toBeInTheDocument();
  });

  it("omits caption when no children", () => {
    render(<EditorialCard href="/m/1" title="Only" />);
    expect(screen.getByRole("link").querySelectorAll("span")).toHaveLength(1);
  });
});

describe("SectionLabel", () => {
  it("renders an uppercase label paragraph", () => {
    render(<SectionLabel className="mine">Events</SectionLabel>);
    const p = screen.getByText("Events");
    expect(p.tagName).toBe("P");
    expect(p).toHaveClass("uppercase", "mine");
  });
});

describe("SectionHeading", () => {
  it("is an h2 by default", () => {
    render(<SectionHeading>Hi</SectionHeading>);
    expect(screen.getByRole("heading", { level: 2, name: "Hi" })).toHaveClass("text-primary");
  });

  it("renders h1 when as=h1", () => {
    render(<SectionHeading as="h1">Big</SectionHeading>);
    const h = screen.getByRole("heading", { level: 1, name: "Big" });
    expect(h).toHaveClass("text-display-fluid");
  });

  it("uses white text when inverse", () => {
    render(<SectionHeading inverse>Inv</SectionHeading>);
    const h = screen.getByRole("heading");
    expect(h).toHaveClass("text-white");
    expect(h).not.toHaveClass("text-primary");
  });
});

describe("Container and Section", () => {
  it("Container renders a div by default and supports as", () => {
    const { container, rerender } = render(<Container>c</Container>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
    expect(container.firstElementChild).toHaveClass("max-w-content");
    rerender(<Container as="main">c</Container>);
    expect(container.firstElementChild?.tagName).toBe("MAIN");
  });

  it("Section wraps children, passes id, and optionally adds divider", () => {
    const { container, rerender } = render(<Section id="s">kid</Section>);
    const s = container.querySelector("section")!;
    expect(s).toHaveAttribute("id", "s");
    expect(s).not.toHaveClass("border-t");
    expect(within(s).getByText("kid")).toHaveClass("max-w-content");
    rerender(<Section divider innerClassName="inner">kid</Section>);
    expect(container.querySelector("section")).toHaveClass("border-t");
    expect(screen.getByText("kid")).toHaveClass("inner");
  });
});
