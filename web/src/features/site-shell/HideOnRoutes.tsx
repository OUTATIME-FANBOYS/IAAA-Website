"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders children everywhere except on the given exact paths. */
export function HideOnRoutes({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname();
  return paths.includes(pathname) ? null : <>{children}</>;
}
