import Image from "next/image";
import Link from "next/link";
import { SmartLink } from "@/components/ui";
import { SocialGlyph, type SocialIcon } from "./icons";
import type { NavLink } from "./SiteHeader";

export interface SocialLink {
  /** Accessible name; icons carry no visible text. */
  label: string;
  href: string;
  icon: SocialIcon;
}

type Logo = { src: string; alt: string };

export interface SiteFooterProps {
  title?: string;
  tagline?: string;
  supportLink?: NavLink | null;
  socials?: SocialLink[];
  caption?: string;
  /** Light mark for the dark footer. */
  logo?: Logo | null;
  /** Accessible name of the logo link (links home). */
  homeLabel?: string;
}

export function SiteFooter({ title, tagline, supportLink, socials = [], caption, logo, homeLabel }: SiteFooterProps) {
  const mark = logo ?? { src: "/logo-light.png", alt: "" };
  return (
    <footer className="bg-primary px-6 pt-12 tablet:px-8">
      <div className="mx-auto flex max-w-content flex-col gap-10">
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label={homeLabel ?? title} className="shrink-0">
              <Image src={mark.src} alt="" width={96} height={96} className="h-20 w-20" />
            </Link>
            <div className="flex flex-col gap-1">
              {title ? <p className="font-serif text-card font-medium text-paper">{title}</p> : null}
              {tagline ? <p className="text-meta text-paper/80">{tagline}</p> : null}
            </div>
          </div>
          {supportLink ? (
            <SmartLink
              href={supportLink.href}
              className="text-ui font-semibold text-blossom underline decoration-blossom/40 underline-offset-4 transition-[text-decoration-color,opacity] duration-400 ease-ds hover:decoration-blossom hover:opacity-85"
            >
              {supportLink.label}
            </SmartLink>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 border-t border-paper/20 py-6 tablet:flex-row tablet:items-center tablet:justify-between">
          {caption ? <p className="text-meta text-paper/70">{caption}</p> : <span />}
          <ul className="flex items-center gap-3">
            {socials.map((s) => (
              <li key={s.href}>
                <SmartLink
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-400 hover:border-blossom hover:bg-blossom hover:text-primary active:scale-95 active:bg-blossom/80"
                >
                  <SocialGlyph name={s.icon} />
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
