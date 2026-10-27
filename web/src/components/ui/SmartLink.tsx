import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface SmartLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children?: ReactNode;
}

/** Sections already built in this app; old-site URLs for these resolve locally. */
const BUILT = /^\/(about|events|members|ways-to-give)(\/|$|\?|#)/;

function toLocalPath(href: string): string | null {
  const m = href.match(/^https?:\/\/(?:www\.)?indianamericanartists\.org(\/.*)?$/);
  if (!m) return null;
  const path = m[1] || "/";
  return path === "/" || path === "/home" ? "/" : BUILT.test(path) ? path : null;
}

/** Internal paths use next/link; absolute URLs use a plain anchor (external opens in a new tab). */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  href = toLocalPath(href) ?? href;
  if (/^(https?:)?\/\//.test(href) || href.startsWith("mailto:")) {
    const isOwn = href.includes("indianamericanartists.org");
    return (
      <a
        href={href}
        {...(isOwn ? {} : { target: "_blank", rel: "noopener noreferrer" })}
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
