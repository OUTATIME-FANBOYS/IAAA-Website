"use client";

import { useState } from "react";

/** Copies `text` to the clipboard and briefly shows `copiedLabel`. */
export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 cursor-pointer rounded-ds bg-blossom/50 px-3 py-1 text-[0.8125rem] font-semibold text-burgundy transition-[background-color,color,transform] duration-300 hover:bg-burgundy hover:text-white active:scale-95 active:bg-burgundy/85 active:text-white"
    >
      <span aria-live="polite">{copied && copiedLabel ? copiedLabel : label}</span>
    </button>
  );
}
