import type { ReactNode } from "react";
import { cn } from "./cn";

export interface SectionHeadingProps {
  children: ReactNode;
  /** Render as h1 (display size) instead of h2 */
  as?: "h1" | "h2";
  /** Use white text (for dark/burgundy backgrounds) */
  inverse?: boolean;
  className?: string;
}

export function SectionHeading({ children, as = "h2", inverse, className }: SectionHeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-serif",
        as === "h1"
          ? "text-display-fluid"
          : "text-heading font-medium text-balance max-tablet:text-[1.875rem]",
        inverse ? "text-white" : "text-primary",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
