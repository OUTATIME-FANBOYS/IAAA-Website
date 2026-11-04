import type { ReactNode } from "react";
import { cn } from "./cn";
import { SmartLink } from "./SmartLink";

export interface EditorialCardProps {
  href: string;
  title: ReactNode;
  /** Optional small image (e.g. an Avatar) shown to the left of the title. */
  media?: ReactNode;
  /** Optional extra content under the title. Plain text is trimmed to 3 lines; the card keeps a fixed height. */
  children?: ReactNode;
  className?: string;
}

export function EditorialCard({ href, title, media, children, className }: EditorialCardProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "flex h-[12.5rem] flex-col gap-3 overflow-hidden rounded-ds border border-subtle bg-white/60 p-6",
        "transition-colors duration-400 ease-ds hover:border-pacific hover:bg-white active:border-burgundy active:bg-white",
        className,
      )}
    >
      {media ? (
        <span className="flex shrink-0 items-center gap-4">
          {media}
          <span className="line-clamp-2 font-serif text-card font-medium text-primary">{title}</span>
        </span>
      ) : (
        <span className="line-clamp-2 shrink-0 font-serif text-card font-medium text-primary">{title}</span>
      )}
      {children ? (
        <span className={cn("min-h-0 text-meta text-caption", typeof children === "string" && "line-clamp-3")}>{children}</span>
      ) : null}
    </SmartLink>
  );
}
