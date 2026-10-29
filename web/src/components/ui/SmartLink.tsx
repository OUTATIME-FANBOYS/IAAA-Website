import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface SmartLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: ReactNode;
}

/** Sections already built in this app; old-site URLs for these resolve locally. */
const BUILT = /^\/(about|events|members|membership|ways-to-give)(\/|$|\?|#)/;

/** Hosts of this organization's own site (compared exactly, never by substring). */
const OWN_HOSTS = new Set(["indianamericanartists.org", "www.indianamericanartists.org"]);

/** Only these schemes may appear in a link. Anything else (javascript:, data:, vbscript:, ...) is never rendered as a link. */
const SAFE_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Parses an absolute URL (with a scheme, or protocol-relative); returns null for relative paths. */
function parseAbsolute(href: string): URL | null {
  const trimmed = href.trim();
  // Browsers ignore tabs/newlines and leading control characters inside a scheme, so strip them first.
  const cleaned = trimmed.replace(/[\u0000-\u001f\u007f\s]/g, "");
  if (!/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(cleaned)) return null;
  try {
    return new URL(cleaned, "https://placeholder.invalid");
  } catch {
    return null;
  }
}

function toLocalPath(url: URL): string | null {
  if (!OWN_HOSTS.has(url.hostname.toLowerCase()) || !/^https?:$/.test(url.protocol)) return null;
  const path = url.pathname + url.search + url.hash;
  return url.pathname === "/" || url.pathname === "/home" ? "/" : BUILT.test(path) ? path : null;
}

/**
 * Internal paths use next/link; absolute URLs use a plain anchor (external opens in a new tab).
 * Links with an unsafe scheme render their text without a link.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const absolute = parseAbsolute(href);
  if (absolute) {
    if (!SAFE_SCHEMES.has(absolute.protocol)) {
      return <span {...(rest as AnchorHTMLAttributes<HTMLSpanElement>)}>{children}</span>;
    }
    const local = toLocalPath(absolute);
    if (local) {
      return (
        <Link href={local} {...rest}>
          {children}
        </Link>
      );
    }
    const isOwn = OWN_HOSTS.has(absolute.hostname.toLowerCase());
    const external = /^https?:$/.test(absolute.protocol) && !isOwn;
    return (
      <a
        href={href.trim()}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
