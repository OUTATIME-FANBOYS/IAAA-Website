"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { SmartLink } from "@/components/ui";
import type { MemberMenuItem, MembersMenuLabels } from "./MembersMenu";

export interface MobileNavProps {
  links: { label: string; href: string }[];
  founders: MemberMenuItem[];
  members?: MembersMenuLabels;
  /** Accessible names of the hamburger button (from Site settings). */
  openLabel: string;
  closeLabel: string;
}

const linkClass =
  "block py-3 text-card font-medium text-primary transition-colors duration-400 group-data-[scrolled=true]:text-white";
const subLinkClass =
  "block py-2 text-body text-primary/80 transition-colors duration-400 group-data-[scrolled=true]:text-white/80";

/** Hamburger button and slide-down panel for screens narrower than the tablet breakpoint. */
export function MobileNav({ links, founders, members, openLabel, closeLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia?.("(min-width: 810px)");
    const onChange = () => mq?.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    mq?.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mq?.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <div className="tablet:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-ds text-primary transition-colors duration-400 group-data-[scrolled=true]:text-white"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-subtle bg-paper px-6 pb-6 pt-2 shadow-md group-data-[scrolled=true]:border-white/20 group-data-[scrolled=true]:bg-burgundy"
      >
        <nav className="mx-auto flex max-w-content flex-col divide-y divide-subtle group-data-[scrolled=true]:divide-white/20">
          {links.map((l) => (
            <SmartLink key={`${l.href}-${l.label}`} href={l.href} onClick={close} className={linkClass}>
              {l.label}
            </SmartLink>
          ))}
          {members?.label ? (
            <div className="py-3">
              <p className="text-card font-medium text-primary group-data-[scrolled=true]:text-white">{members.label}</p>
              <div className="flex flex-col pl-4 pt-1">
                {members.all ? (
                  <Link href="/members" onClick={close} className={subLinkClass}>
                    {members.all}
                  </Link>
                ) : null}
                {members.org && members.orgHref ? (
                  <Link href={members.orgHref} onClick={close} className={subLinkClass}>
                    {members.org}
                  </Link>
                ) : null}
                {founders.length > 0 && members.founders ? (
                  <p className="pt-3 text-label font-semibold uppercase text-burgundy group-data-[scrolled=true]:text-blossom">
                    {members.founders}
                  </p>
                ) : null}
                {founders.map((f) => (
                  <Link key={f.slug} href={`/members/${f.slug}`} onClick={close} className={subLinkClass}>
                    {f.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
