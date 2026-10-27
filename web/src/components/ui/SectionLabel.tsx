import type { ReactNode } from "react";
import { cn } from "./cn";

export interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn("text-label font-semibold uppercase text-burgundy", className)}>
      {children}
    </p>
  );
}
