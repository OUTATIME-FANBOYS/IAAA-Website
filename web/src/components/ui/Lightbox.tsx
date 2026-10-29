"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";

export interface LightboxImage {
  /** Large version shown in the overlay. */
  src: string;
  alt: string;
  title?: string;
  /** e.g. "Oil on canvas · 24x30 inches" */
  details?: string;
  description?: string;
  /** Optional link shown under the caption, e.g. the artist's page. */
  link?: { label: string; href: string };
}

export interface LightboxLabels {
  close: string;
  previous: string;
  next: string;
  /** Accessible name of the overlay dialog. */
  dialog: string;
}

const Ctx = createContext<((index: number) => void) | null>(null);

/**
 * Wraps a set of thumbnails. Put a <LightboxTrigger index={n}> around each thumbnail; clicking
 * opens a full-screen viewer with previous/next buttons, arrow keys, swipe and Escape to close.
 */
export function LightboxGroup({
  images,
  labels,
  children,
}: {
  images: LightboxImage[];
  labels: LightboxLabels;
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const open = index !== null;

  const show = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  const openAt = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setIndex(i);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      else if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, count, close]);

  const current = index === null ? null : images[index];
  const nav =
    "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white " +
    "transition-[background-color,transform] duration-200 hover:bg-white/30 active:scale-95 active:bg-white/40";

  return (
    <Ctx.Provider value={openAt}>
      {children}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialog}
          className="fixed inset-0 z-[100] flex flex-col bg-[#10181c]/95"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50 && count > 1) show((index ?? 0) + (dx < 0 ? 1 : -1));
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-meta tabular-nums">
              {(index ?? 0) + 1} / {count}
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label={labels.close}
              onClick={close}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,transform] duration-200 hover:bg-white/20 active:scale-95 active:bg-white/30"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 tablet:px-20" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.src} alt={current.alt} className="max-h-full max-w-full rounded-ds object-contain" />
            {count > 1 ? (
              <>
                <button type="button" aria-label={labels.previous} onClick={() => show((index ?? 0) - 1)} className={cn(nav, "left-2 tablet:left-6")}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button type="button" aria-label={labels.next} onClick={() => show((index ?? 0) + 1)} className={cn(nav, "right-2 tablet:right-6")}>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>
          <div className="max-h-[28vh] shrink-0 overflow-y-auto px-6 py-4 text-center text-white" onClick={(e) => e.stopPropagation()}>
            {current.title ? <p className="font-serif text-card font-medium">{current.title}</p> : null}
            {current.details ? <p className="text-meta text-white/70">{current.details}</p> : null}
            {current.description ? <p className="mx-auto mt-2 max-w-[720px] text-meta text-white/85">{current.description}</p> : null}
            {current.link ? (
              <a
                href={current.link.href}
                className="mt-2 inline-block text-ui font-semibold text-blossom underline underline-offset-4 transition-opacity duration-200 hover:opacity-80 active:opacity-60"
              >
                {current.link.label}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

/** Makes its children a button that opens the overlay at `index`. Must be inside a LightboxGroup. */
export function LightboxTrigger({
  index,
  label,
  className,
  children,
}: {
  index: number;
  /** Accessible name, e.g. the artwork title. */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const open = useContext(Ctx);
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      onClick={() => open?.(index)}
      className={cn("block w-full cursor-zoom-in text-left transition-[opacity,transform] duration-300 hover:opacity-90 active:scale-[0.99] active:opacity-80", className)}
    >
      {children}
    </button>
  );
}
