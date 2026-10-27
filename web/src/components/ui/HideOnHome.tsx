"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders children everywhere except the home page. */
export function HideOnHome({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
