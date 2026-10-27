import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgramModel, getOrgStructure } from "@/features/org";

describe("ProgramModel", () => {
  it("shows officers, the core mission, advisors and standing programs", async () => {
    const org = await getOrgStructure();
    render(<ProgramModel org={org} />);
    for (const r of org.leadership) {
      expect(screen.getByRole("heading", { level: 3, name: r.title })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: r.person.name })).toHaveAttribute("href", r.person.href);
    }
    expect(screen.getByText(org.mission)).toBeInTheDocument();
    for (const a of org.advisoryBoard) expect(screen.getByRole("link", { name: a.name })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(org.standingPrograms.length);
    expect(screen.getByText(/Minimum viable board/)).toBeInTheDocument();
  });
});
