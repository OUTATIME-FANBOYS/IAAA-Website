import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface EditorialLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function EditorialLink({ href, children, className }: EditorialLinkProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "text-ui font-semibold text-burgundy underline decoration-burgundy/40 underline-offset-4",
        "transition-[text-decoration-color,opacity] duration-400 ease-ds hover:decoration-burgundy hover:opacity-85 active:opacity-65",
        className,
      )}
    >
      {children}
    </SmartLink>
  );
}
