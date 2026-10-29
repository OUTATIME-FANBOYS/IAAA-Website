import Image from "next/image";
import Link from "next/link";
import { MembersMenu, type MemberMenuItem, type MembersMenuLabels } from "./MembersMenu";
import { SmartLink } from "@/components/ui";
import { MobileNav } from "./MobileNav";
import { StickyHeader } from "./StickyHeader";

export interface NavLink {
  label: string;
  href: string;
}

type Logo = { src: string; alt: string };

export interface SiteHeaderProps {
  siteName: string;
  links: NavLink[];
  /** Dark mark shown at the top of the page. */
  logo?: Logo | null;
  /** Light mark shown once the bar turns burgundy. */
  logoLight?: Logo | null;
  /** Founding members shown in a dropdown; omitted or empty hides the menu. */
  founders?: MemberMenuItem[];
  membersMenu?: MembersMenuLabels;
  /** Accessible names of the mobile hamburger button. */
  menuLabels?: { open: string; close: string };
}

const FALLBACK_LOGO: Logo = { src: "/logo.png", alt: "" };
const FALLBACK_LOGO_LIGHT: Logo = { src: "/logo-light.png", alt: "" };

export function SiteHeader({
  siteName,
  links,
  logo,
  logoLight,
  founders = [],
  membersMenu,
  menuLabels,
}: SiteHeaderProps) {
  const dark = logo ?? FALLBACK_LOGO;
  const light = logoLight ?? FALLBACK_LOGO_LIGHT;
  return (
    <StickyHeader>
      <div className="mx-auto flex w-[93.33%] max-w-content items-center justify-between gap-4 px-0 py-2 tablet:flex-col tablet:items-stretch tablet:justify-start tablet:py-3 desktop:flex-row desktop:items-center desktop:gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-sitename font-semibold text-burgundy transition-[opacity,color] group-data-[scrolled=true]:text-white duration-400 hover:opacity-85 desktop:flex-1"
        >
          <span className="sr-only">{siteName}</span>
          <Image src={dark.src} alt="" width={96} height={96} priority className="h-14 w-14 shrink-0 tablet:h-20 tablet:w-20 group-data-[scrolled=true]:hidden" />
          <Image src={light.src} alt="" width={96} height={96} priority className="hidden h-14 w-14 shrink-0 tablet:h-20 tablet:w-20 group-data-[scrolled=true]:block" />
        </Link>
        <nav aria-label={siteName} className="hidden flex-wrap items-center gap-x-6 gap-y-2 tablet:flex">
          {links.map((l) => (
            <SmartLink
              key={`${l.href}-${l.label}`}
              href={l.href}
              className="text-ui font-semibold text-primary transition-[opacity,color] duration-400 hover:opacity-70 group-data-[scrolled=true]:text-white"
            >
              {l.label}
            </SmartLink>
          ))}
          {membersMenu?.label ? <MembersMenu founders={founders} labels={membersMenu} /> : null}
        </nav>
        {menuLabels ? (
          <MobileNav links={links} founders={founders} members={membersMenu} openLabel={menuLabels.open} closeLabel={menuLabels.close} />
        ) : null}
      </div>
    </StickyHeader>
  );
}
