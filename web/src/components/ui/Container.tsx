import type { ElementType, ReactNode } from "react";
import { cn } from "./cn";

export interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/** Centered 1120px content wrapper. */
export function Container({ children, as: Tag = "div", className }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-content", className)}>{children}</Tag>;
}

export type SectionTone = "paper" | "blossom" | "pacific";

const TONES: Record<SectionTone, string> = {
  paper: "",
  blossom: "bg-blossom/30",
  pacific: "bg-pacific/15",
};

export interface SectionProps {
  children: ReactNode;
  /** Background band from the palette (default: page beige). */
  tone?: SectionTone;
  /** Adds the 1px subtle top divider (use on every section after the first). */
  divider?: boolean;
  /** Background/utility overrides for the outer full-width element. */
  className?: string;
  /** Classes for the inner 1120px container. */
  innerClassName?: string;
  id?: string;
}

/** Full-width section: padding 64/32 (40/24 phone), optional top border, inner container. */
export function Section({ children, tone = "paper", divider, className, innerClassName, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 py-10 tablet:px-8 tablet:py-16",
        TONES[tone],
        divider && "border-t border-subtle",
        className,
      )}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}
