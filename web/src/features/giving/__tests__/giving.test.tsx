import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CopyButton, DONATE_URL, GivingChannels, ZELLE_EMAIL } from "@/features/giving";

describe("GivingChannels", () => {
  it("lists six channels with the donate link and Zelle email", () => {
    render(<GivingChannels />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Donate online" })).toHaveAttribute("href", DONATE_URL);
    expect(screen.getByText(ZELLE_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(/1461 Edsel Dr/)).toBeInTheDocument();
  });
});

describe("CopyButton", () => {
  it("copies text and confirms", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="hello" label="Copy email" />);
    await user.click(screen.getByRole("button"));
    expect(await screen.findByText("Copied")).toBeInTheDocument();
    expect(await navigator.clipboard.readText()).toBe("hello");
  });
});
