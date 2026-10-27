import { SmartLink } from "./SmartLink";
import type { NavLink } from "./SiteHeader";

export interface SiteFooterProps {
  title?: string;
  tagline?: string;
  supportLink?: NavLink;
  links?: NavLink[];
  caption?: string;
}

const linkClass =
  "text-ui font-semibold text-blossom underline decoration-blossom/40 underline-offset-4 transition-[text-decoration-color,opacity] duration-400 ease-ds hover:decoration-blossom hover:opacity-85";

export function SiteFooter({
  title = "Indian American Artists Association",
  tagline = "Empower South Asian artists. Build community. Create impact.",
  supportLink = { label: "Support our community", href: "/ways-to-give" },
  links = [
    { label: "Join WhatsApp community", href: "https://chat.whatsapp.com/HRLR9Yb93A26WMRNhhFV9S" },
    { label: "Join our mailing list", href: "http://eepurl.com/iULW-Y" },
    { label: "Instagram", href: "https://www.instagram.com/artistsiaaa/" },
    { label: "Donate", href: "https://app.donorly.ai/en/donate/iaaa?org_name=iaaa" },
  ],
  caption = "IAAA is a 501(c)(3) nonprofit supporting Indian American artists and arts education.",
}: SiteFooterProps) {
  return (
    <footer className="bg-primary px-6 py-12 tablet:px-8">
      <div className="mx-auto flex max-w-content flex-col gap-6">
        <p className="font-serif text-card font-medium text-paper">{title}</p>
        <p className="text-body text-paper/80">{tagline}</p>
        <div>
          <SmartLink href={supportLink.href} className={linkClass}>
            {supportLink.label}
          </SmartLink>
        </div>
        <div className="flex flex-wrap gap-6">
          {links.map((l) => (
            <SmartLink key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </SmartLink>
          ))}
        </div>
        <p className="text-meta text-paper/70">{caption}</p>
      </div>
    </footer>
  );
}
