"use client";

import { useState } from "react";
import { EditorialCard } from "@/components/ui";
import { MEMBER_GROUP_LABELS, type Member, type MemberGroup } from "./data";

type Filter = "all" | MemberGroup;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "leadership", label: MEMBER_GROUP_LABELS.leadership },
  { value: "advisory", label: MEMBER_GROUP_LABELS.advisory },
  { value: "member", label: MEMBER_GROUP_LABELS.member },
];

export function MemberDirectory({ members }: { members: Member[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? members : members.filter((m) => m.group === filter);

  if (members.length === 0) {
    return <p className="text-body text-secondary">No members to show yet. Please check back soon.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter members by group" className="flex flex-wrap gap-3">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.value)}
              className={
                "min-h-12 cursor-pointer rounded-ds border border-burgundy px-6 py-3 font-sans text-ui font-semibold " +
                "transition-opacity duration-400 ease-ds hover:opacity-85 active:opacity-75 " +
                (active ? "bg-burgundy text-white" : "bg-paper text-burgundy")
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "member" : "members"}
      </p>

      {visible.length === 0 ? (
        <p className="text-body text-secondary">No members in this group yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
          {visible.map((m) => (
            <li key={m.slug}>
              <EditorialCard href={`/members/${m.slug}`} title={m.name}>
                {[m.role, m.medium, m.location].filter(Boolean).join(" · ")}
              </EditorialCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
