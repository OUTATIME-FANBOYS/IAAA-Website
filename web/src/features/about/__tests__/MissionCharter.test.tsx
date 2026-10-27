import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MissionCharter, MISSION_STATEMENT, ELIGIBILITY_STATEMENT } from "@/features/about";

describe("MissionCharter", () => {
  it("renders the mission and eligibility statements verbatim", () => {
    render(<MissionCharter />);
    expect(screen.getByText(`“${MISSION_STATEMENT}”`)).toBeInTheDocument();
    expect(screen.getByText(`“${ELIGIBILITY_STATEMENT}”`)).toBeInTheDocument();
    expect(screen.getByText("Our mission")).toBeInTheDocument();
    expect(screen.getByText("Who can join")).toBeInTheDocument();
  });
});
