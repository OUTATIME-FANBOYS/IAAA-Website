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
  primary: "bg-burgundy text-white",
  inverse: "bg-white text-burgundy",
  secondary: "bg-paper text-burgundy border border-burgundy",
};

export function Button({ href, variant = "primary", children, className }: ButtonProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-ds px-6 py-3 text-center font-sans text-ui font-semibold",
        "transition-opacity duration-400 ease-ds hover:opacity-85 active:opacity-75",
        variants[variant],
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}
