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

export interface SiteFooterProps {
  title?: string;
  tagline?: string;
  supportLink?: NavLink;
  socials?: SocialLink[];
  caption?: string;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { label: "Join WhatsApp community", href: "https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S", icon: "whatsapp" },
  { label: "Instagram", href: "https://www.instagram.com/artistsiaaa/", icon: "instagram" },
  { label: "Join our mailing list", href: "http://eepurl.com/iULW-Y", icon: "mail" },
  { label: "Donate", href: "https://app.donorly.ai/en/donate/iaaa?org_name=iaaa", icon: "donate" },
];

export function SiteFooter({
  title = "Indian American Artists Association",
  tagline = "Empower South Asian artists. Build community. Create impact.",
  supportLink = { label: "Support our community", href: "/ways-to-give" },
  socials = DEFAULT_SOCIALS,
  caption = "IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education.",
}: SiteFooterProps) {
  return (
    <footer className="bg-primary px-6 pt-12 tablet:px-8">
      <div className="mx-auto flex max-w-content flex-col gap-10">
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="Home" className="shrink-0">
              <Image src="/logo-light.png" alt="" width={96} height={96} className="h-20 w-20" />
            </Link>
            <div className="flex flex-col gap-1">
              <p className="font-serif text-card font-medium text-paper">{title}</p>
              <p className="text-meta text-paper/80">{tagline}</p>
            </div>
          </div>
          <SmartLink
            href={supportLink.href}
            className="text-ui font-semibold text-blossom underline decoration-blossom/40 underline-offset-4 transition-[text-decoration-color,opacity] duration-400 ease-ds hover:decoration-blossom hover:opacity-85"
          >
            {supportLink.label}
          </SmartLink>
        </div>
        <div className="flex flex-col gap-4 border-t border-paper/20 py-6 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="text-meta text-paper/70">{caption}</p>
          <ul className="flex items-center gap-3">
            {socials.map((s) => (
              <li key={s.href}>
                <SmartLink
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors duration-400 hover:border-blossom hover:bg-blossom hover:text-primary"
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
