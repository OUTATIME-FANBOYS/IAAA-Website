import Image from "next/image";
import Link from "next/link";
import { MembersMenu, type MemberMenuItem } from "./MembersMenu";
import { SmartLink } from "@/components/ui";
import { StickyHeader } from "./StickyHeader";

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteHeaderProps {
  siteName?: string;
  links?: NavLink[];
  /** Founding members shown in a dropdown; omitted or empty hides the menu. */
  founders?: MemberMenuItem[];
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: "About", href: "https://www.indianamericanartists.org/about" },
  { label: "Events", href: "https://www.indianamericanartists.org/events" },
  {
    label: "Membership",
    href: "https://www.indianamericanartists.org/membership",
  },
  {
    label: "Ways to Give",
    href: "https://www.indianamericanartists.org/ways-to-give",
  },
];

export function SiteHeader({
  siteName = "Indian American Artists Association",
  links = DEFAULT_NAV_LINKS,
  founders = [],
}: SiteHeaderProps) {
  return (
    <StickyHeader>
      <div className="mx-auto flex w-[93.33%] max-w-content flex-col gap-4 px-0 py-3 desktop:flex-row desktop:items-center desktop:gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-sitename font-semibold text-burgundy transition-[opacity,color] group-data-[scrolled=true]:text-white duration-400 hover:opacity-85 desktop:flex-1"
        >
          <span className="sr-only">{siteName}</span>
          <Image src="/logo.png" alt="" width={96} height={96} priority className="h-20 w-20 shrink-0 group-data-[scrolled=true]:hidden" />
          <Image src="/logo-light.png" alt="" width={96} height={96} priority className="hidden h-20 w-20 shrink-0 group-data-[scrolled=true]:block" />
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <SmartLink
              key={`${l.href}-${l.label}`}
              href={l.href}
              className="text-ui font-semibold text-primary transition-[opacity,color] duration-400 hover:opacity-70 group-data-[scrolled=true]:text-white"
            >
              {l.label}
            </SmartLink>
          ))}
          <MembersMenu founders={founders} />
        </nav>
      </div>
    </StickyHeader>
  );
}
