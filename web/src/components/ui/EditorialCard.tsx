import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface EditorialCardProps {
  href: string;
  title: ReactNode;
  /** Optional extra content under the title (caption text, etc.) */
  children?: ReactNode;
  className?: string;
}

export function EditorialCard({ href, title, children, className }: EditorialCardProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "flex h-full flex-col gap-4 rounded-ds border border-subtle bg-white/60 p-6",
        "transition-colors duration-400 ease-ds hover:border-pacific hover:bg-white",
        className,
      )}
    >
      <span className="font-serif text-card font-medium text-primary">{title}</span>
      {children ? <span className="text-meta text-caption">{children}</span> : null}
    </SmartLink>
  );
}
