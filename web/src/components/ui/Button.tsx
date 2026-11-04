import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export type ButtonVariant = "primary" | "inverse" | "secondary";

export interface ButtonProps {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

const variants: Record<ButtonVariant, string> = {
  // Hover flips the colors; pressed is a softer tint of the flipped state.
  primary:
    "border border-burgundy bg-burgundy text-white hover:bg-paper hover:text-burgundy active:bg-burgundy/15 active:text-burgundy",
  inverse:
    "border border-white bg-white text-burgundy hover:bg-transparent hover:text-white active:bg-white/25 active:text-white",
  secondary:
    "border border-burgundy bg-paper text-burgundy hover:bg-burgundy hover:text-white active:bg-burgundy/85 active:text-white",
};

/** The button look as a class string, for native <button> elements (form submits) and anchors that are not links to a page. */
export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-12 items-center justify-center rounded-ds px-6 py-3 text-center font-sans text-ui font-semibold",
    "transition-[background-color,color,transform] duration-300 ease-ds active:scale-[0.98]",
    "disabled:cursor-wait disabled:opacity-70",
    variants[variant],
    className,
  );
}

export function Button({ href, variant = "primary", children, className }: ButtonProps) {
  return (
    <SmartLink href={href} className={buttonClass(variant, className)}>
      {children}
    </SmartLink>
  );
}
