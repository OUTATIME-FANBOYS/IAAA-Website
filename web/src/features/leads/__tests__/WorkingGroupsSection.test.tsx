import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../actions", () => ({ submitLead: vi.fn() }));

import { WorkingGroupsSection } from "../WorkingGroupsSection";

const props = {
  heading: "Seven roles.",
  stats: [{ label: "Members", value: "~50 artists" }],
  groups: [
    { name: "Fundraising", title: "Keep the lights on", quote: "Grants.", tasks: ["Find grants"], fit: "Writers" },
    { name: "Events", tasks: [] },
  ],
  fitLabel: "Fit",
  emptyGroupText: "Be the first",
  countOne: "{count} member in {names}",
  countMany: "{count} members in {names}",
  moreNames: "+{count} more",
  form: { nameLabel: "Your name", firstChoiceLabel: "First choice", submitLabel: "Claim" },
};

describe("WorkingGroupsSection", () => {
  it("renders the facts, a card per group and the form with the group names as options", async () => {
    render(await WorkingGroupsSection({ ...props, signups: null }));
    expect(screen.getByRole("heading", { name: "Seven roles." })).toBeInTheDocument();
    expect(screen.getByText("~50 artists")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Keep the lights on" })).toBeInTheDocument();
    expect(screen.getByText("Find grants")).toBeInTheDocument();
    expect(screen.getByText("Fit:")).toBeInTheDocument();
    const select = screen.getByLabelText("First choice");
    expect(within(select).getAllByRole("option").map((o) => o.textContent)).toContain("Fundraising");
    expect(screen.queryByText("Be the first")).toBeNull(); // no sheet data: no counts at all
  });

  it("shows who has signed up, or the empty text", async () => {
    const signups = { counts: { Fundraising: 6 }, names: { Fundraising: ["A", "B", "C", "D", "E", "F"] } };
    render(await WorkingGroupsSection({ ...props, signups }));
    expect(screen.getByText("6 members in A, B, C, D +2 more")).toBeInTheDocument();
    expect(screen.getByText("Be the first")).toBeInTheDocument();
  });
});
