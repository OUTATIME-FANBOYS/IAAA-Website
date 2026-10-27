"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Sticky header shell: paper at the top of the page, burgundy once scrolled. Children react via `group-data-[scrolled=true]`. */
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group sticky top-0 z-50 bg-paper transition-colors duration-400 data-[scrolled=true]:bg-burgundy"
    >
      {children}
    </header>
  );
}
