import { cn } from "./cn";

export interface InfoCardItem {
  title: string;
  description?: string;
  /** Small uppercase line under the description. */
  tag?: string;
}

export interface InfoCardGridProps {
  items: InfoCardItem[];
  /** Columns on desktop (tablet always uses 2). */
  columns?: 3 | 4;
  className?: string;
}

/** Responsive grid of titled cards (non-interactive). */
export function InfoCardGrid({ items, columns = 4, className }: InfoCardGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-6 tablet:grid-cols-2",
        columns === 4 ? "desktop:grid-cols-4" : "desktop:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className="flex h-full flex-col gap-3 rounded-ds border border-subtle bg-white/60 p-6"
        >
          <h3 className="font-serif text-card font-medium text-primary">{item.title}</h3>
          {item.description ? <p className="text-meta text-secondary">{item.description}</p> : null}
          {item.tag ? (
            <p className="mt-auto border-t border-subtle pt-3 text-label font-semibold uppercase text-burgundy">
              {item.tag}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
