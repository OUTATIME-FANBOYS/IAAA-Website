import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InfoCardGrid } from "@/components/ui";

describe("InfoCardGrid", () => {
  it("renders titles as h3 and optional descriptions", () => {
    render(<InfoCardGrid items={[{ title: "A", description: "Desc A" }, { title: "B" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 3, name: "A" })).toBeInTheDocument();
    expect(screen.getByText("Desc A")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "B" })).toBeInTheDocument();
  });

  it("renders an empty list for no programs", () => {
    render(<InfoCardGrid items={[]} />);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
