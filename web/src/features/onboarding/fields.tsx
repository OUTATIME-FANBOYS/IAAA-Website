import type { ReactNode } from "react";

export const inputClass =
  "min-h-12 w-full rounded-ds border border-subtle bg-white px-4 py-3 text-ui text-primary " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy aria-[invalid=true]:border-burgundy";

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-meta font-medium text-primary">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-caption">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.8125rem] font-medium text-burgundy">
          {error}
        </p>
      ) : null}
    </div>
  );
}
