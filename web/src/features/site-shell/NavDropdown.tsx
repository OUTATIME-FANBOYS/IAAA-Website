"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SmartLink } from "@/components/ui";

export interface NavDropdownProps {
  label: string;
  /** The item's own page, shown first inside the dropdown. */
  href: string;
  items: { label: string; href: string }[];
}

/** Header link that opens a small dropdown of related pages (set in Site settings → Navigation). */
export function NavDropdown({ label, href, items }: NavDropdownProps) {
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

  const itemClass = "block px-4 py-2 text-ui text-primary transition-opacity duration-400 hover:opacity-70 active:opacity-50";
  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-1 text-ui font-semibold text-primary transition-[opacity,color] duration-400 hover:opacity-70 active:opacity-50 group-data-[scrolled=true]:text-white"
      >
        {label}
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
      <ul id={listId} hidden={!open} className="absolute left-0 top-full z-10 mt-2 min-w-56 rounded-ds border border-subtle bg-paper py-2">
        {[{ label, href }, ...items].map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <SmartLink href={item.href} onClick={() => setOpen(false)} className={itemClass}>
              {item.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
