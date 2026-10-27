import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BENEFITS, DuesCard, ELIGIBILITY, EligibilityList, JOIN_URL } from "@/features/membership";

describe("EligibilityList", () => {
  it("lists every eligibility rule", () => {
    render(<EligibilityList />);
    expect(screen.getAllByRole("listitem")).toHaveLength(ELIGIBILITY.length);
  });
});

describe("DuesCard", () => {
  it("shows the $50 price and a join link", () => {
    render(<DuesCard />);
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Become a member/ })).toHaveAttribute("href", JOIN_URL);
  });
});

describe("BENEFITS", () => {
  it("has six benefits with descriptions", () => {
    expect(BENEFITS).toHaveLength(6);
    expect(BENEFITS.every((b) => b.description)).toBe(true);
  });
});
