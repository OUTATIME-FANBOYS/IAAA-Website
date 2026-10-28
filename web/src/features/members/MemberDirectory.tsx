"use client";

import { useState } from "react";
import { EditorialCard } from "@/components/ui";
import type { Member, MemberGroup } from "./data";

type Filter = "all" | MemberGroup;

export interface MemberDirectoryProps {
  members: Member[];
  /** Label of the “show everyone” filter. */
  allLabel: string;
  /** Display names of the groups. */
  groupLabels: Record<MemberGroup, string>;
  /** Screen-reader count text with a {count} placeholder. */
  countLabel?: string;
  /** Shown when the list (or the chosen group) is empty. */
  emptyText?: string;
}

export function MemberDirectory({ members, allLabel, groupLabels, countLabel, emptyText }: MemberDirectoryProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? members : members.filter((m) => m.group === filter);
  const filters = (
    [
      { value: "all", label: allLabel },
      { value: "leadership", label: groupLabels.leadership },
      { value: "advisory", label: groupLabels.advisory },
      { value: "member", label: groupLabels.member },
    ] as { value: Filter; label: string }[]
  ).filter((f) => f.label);

  if (members.length === 0) {
    return emptyText ? <p className="text-body text-secondary">{emptyText}</p> : null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label={allLabel} className="flex flex-wrap gap-3">
        {filters.map((f) => {
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

      {countLabel ? (
        <p className="sr-only" aria-live="polite">
          {countLabel.replace("{count}", String(visible.length))}
        </p>
      ) : null}

      {visible.length === 0 ? (
        emptyText ? <p className="text-body text-secondary">{emptyText}</p> : null
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
