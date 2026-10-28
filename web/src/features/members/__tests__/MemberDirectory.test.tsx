import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemberDirectory } from "@/features/members";

const GROUPS = { leadership: "Leadership", advisory: "Advisory board", member: "Members" };
const props = { allLabel: "All", groupLabels: GROUPS, countLabel: "Showing {count} members", emptyText: "Nobody here" };
import type { Member } from "@/features/members";

const mk = (slug: string, name: string, group: Member["group"]) =>
  ({ slug, name, group, role: "Painter", location: "NYC" }) as Member;

const members = [mk("a", "Alice", "leadership"), mk("b", "Bob", "advisory"), mk("c", "Cara", "member"), mk("d", "Dan", "member")];

describe("MemberDirectory", () => {
  it("shows all members by default with links to bios", () => {
    render(<MemberDirectory members={members} {...props} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByRole("link", { name: /Alice/ })).toHaveAttribute("href", "/members/a");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
  });

  it("filters by group and updates pressed state", async () => {
    const user = userEvent.setup();
    render(<MemberDirectory members={members} {...props} />);
    const btn = screen.getByRole("button", { name: GROUPS.member });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText(/Cara/)).toBeInTheDocument();
    expect(screen.getByText("Showing 2 members")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("shows an empty message for a group with no members", async () => {
    const user = userEvent.setup();
    render(<MemberDirectory members={[mk("a", "Alice", "leadership")]} {...props} />);
    await user.click(screen.getByRole("button", { name: GROUPS.advisory }));
    expect(screen.getByText("Nobody here")).toBeInTheDocument();
  });

  it("shows an empty state with no members", () => {
    render(<MemberDirectory members={[]} {...props} />);
    expect(screen.getByText("Nobody here")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
