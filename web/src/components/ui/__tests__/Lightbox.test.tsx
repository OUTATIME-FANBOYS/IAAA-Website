import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LightboxGroup, LightboxTrigger, type LightboxImage } from "@/components/ui";

const images: LightboxImage[] = [
  { src: "/a.jpg", alt: "First", title: "Reflected", details: "Oil · 30x30", description: "About the first" },
  { src: "/b.jpg", alt: "Second", title: "Chai-walla", link: { label: "Artist page", href: "/members/x" } },
  { src: "/c.jpg", alt: "Third" },
];
const labels = { close: "Close", previous: "Previous image", next: "Next image", dialog: "Image viewer" };

function setup() {
  render(
    <LightboxGroup images={images} labels={labels}>
      {images.map((_, i) => (
        <LightboxTrigger key={i} index={i} label={`Open ${i + 1}`}>
          thumb {i + 1}
        </LightboxTrigger>
      ))}
    </LightboxGroup>,
  );
}

describe("Lightbox", () => {
  it("opens the clicked image with its caption and counter", async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open 2" }));
    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByAltText("Second")).toHaveAttribute("src", "/b.jpg");
    expect(screen.getByText("Chai-walla")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Artist page" })).toHaveAttribute("href", "/members/x");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("slides with the buttons and arrow keys, wrapping around", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Open 1" }));
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByAltText("Second")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByAltText("Third")).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByAltText("First")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    expect(screen.getByAltText("Third")).toBeInTheDocument();
  });

  it("closes with the close button and with Escape, and restores scrolling", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Open 1" }));
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).not.toBe("hidden");
    await user.click(screen.getByRole("button", { name: "Open 3" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
