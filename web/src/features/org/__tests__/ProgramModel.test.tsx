import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramModel, type OrgStructure } from "@/features/org";

const org: OrgStructure = {
  leadership: [{ title: "President", focus: "Vision", person: { name: "Ada", href: "/members/ada" } }],
  advisoryBoard: [{ name: "Bo", href: "/members/bo" }],
  standingPrograms: [{ title: "Exhibitions", description: "Shows", example: "Gallery nights" }],
  flexiblePrograms: [],
};

const copy = {
  eyebrow: "Eco",
  heading: "Program model",
  mission: "Make art",
  missionLabel: "Our mission",
  coreLabel: "The core",
  coreNote: "Minimum viable board",
  advisoryLabel: "Advisory board",
  standingLabel: "Standing programs",
};

describe("ProgramModel", () => {
  it("shows officers, the core mission, advisors and standing programs from the data and copy", () => {
    render(<ProgramModel org={org} copy={copy} />);
    expect(screen.getByRole("heading", { level: 2, name: "Program model" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "President" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ada" })).toHaveAttribute("href", "/members/ada");
    expect(screen.getByText("Make art")).toBeInTheDocument();
    expect(screen.getByText("Minimum viable board")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Exhibitions" })).toBeInTheDocument();
    expect(screen.getByText("Gallery nights")).toBeInTheDocument();
  });

  it("omits the core and advisory blocks when there is no mission or advisors", () => {
    render(<ProgramModel org={{ ...org, advisoryBoard: [] }} copy={{ heading: "Only" }} />);
    expect(screen.queryByText("Make art")).toBeNull();
    expect(screen.queryByText("Advisory board")).toBeNull();
  });
});
