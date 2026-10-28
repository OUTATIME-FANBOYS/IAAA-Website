"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export interface MemberMenuItem {
  name: string;
  slug: string;
}

export interface MembersMenuLabels {
  label: string;
  all?: string;
  org?: string;
  orgHref?: string;
  founders?: string;
}

/** Members disclosure dropdown: directory, org structure, and founding members by name. */
export function MembersMenu({ founders, labels }: { founders: MemberMenuItem[]; labels: MembersMenuLabels }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-1 text-ui font-semibold text-primary transition-[opacity,color] duration-400 hover:opacity-70 group-data-[scrolled=true]:text-white"
      >
        {labels.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform duration-400 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>
      <ul
        id={listId}
        hidden={!open}
        className="absolute left-0 top-full z-10 mt-2 min-w-56 rounded-ds border border-subtle bg-paper py-2 desktop:left-auto desktop:right-0"
      >
        {labels.all ? (
          <li>
            <Link href="/members" onClick={() => setOpen(false)} className="block px-4 py-2 text-ui text-primary transition-opacity duration-400 hover:opacity-70">
              {labels.all}
            </Link>
          </li>
        ) : null}
        {labels.org && labels.orgHref ? (
          <li>
            <Link href={labels.orgHref} onClick={() => setOpen(false)} className="block px-4 py-2 text-ui text-primary transition-opacity duration-400 hover:opacity-70">
              {labels.org}
            </Link>
          </li>
        ) : null}
        {founders.length > 0 && labels.founders ? (
          <li role="presentation" className="mt-2 border-t border-subtle px-4 pb-1 pt-3 text-label font-semibold uppercase text-burgundy">
            {labels.founders}
          </li>
        ) : null}
        {founders.map((f) => (
          <li key={f.slug}>
            <Link href={`/members/${f.slug}`} onClick={() => setOpen(false)} className="block px-4 py-2 text-ui text-primary transition-opacity duration-400 hover:opacity-70">
              {f.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
