"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const existing = document.getElementById(SCRIPT_ID);
    const script = existing ?? Object.assign(document.createElement("script"), { id: SCRIPT_ID, src: SCRIPT_SRC, async: true });
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")), { once: true });
    if (!existing) document.head.appendChild(script);
  });
}

/**
 * Cloudflare Turnstile check. Place it inside a <form>: Cloudflare adds the "cf-turnstile-response" field
 * that the server verifies. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * Change `resetKey` after each submission to get a fresh token (tokens work once).
 * `onToken` receives each new token, or null when the check fails to load or run. Use it when there is no
 * <form> to carry the field.
 */
export function Turnstile({ resetKey, onToken }: { resetKey?: unknown; onToken?: (token: string | null) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let cancelled = false;
    const el = ref.current;
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile) return;
        widget.current = window.turnstile.render(el, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token: string) => onTokenRef.current?.(token),
          // A token that expired while the page sat idle: fetch a fresh one.
          "expired-callback": () => {
            if (widget.current) window.turnstile?.reset(widget.current);
          },
          "error-callback": () => onTokenRef.current?.(null),
        });
      })
      .catch(() => onTokenRef.current?.(null));
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [siteKey]);

  useEffect(() => {
    if (widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
