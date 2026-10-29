import { safeFetch } from "./fetch";
import { imageProps } from "./image";
import { SITE_SETTINGS_QUERY } from "./queries";

export interface SiteLabels {
  [key: string]: string | undefined;
}

export interface SocialLinkData {
  label: string;
  href: string;
  icon: "whatsapp" | "instagram" | "mail" | "donate";
}

export interface SiteSettings {
  siteTitle?: string;
  description?: string;
  logo: { src: string; alt: string } | null;
  logoLight: { src: string; alt: string } | null;
  navigation: { label: string; href: string }[];
  membershipBand: {
    heading?: string;
    body?: string;
    buttonLabel?: string;
    price?: string;
    href?: string;
    hiddenOnPaths: string[];
  } | null;
  footerHeading?: string;
  footerText?: string;
  supportLink: { label: string; href: string } | null;
  socialLinks: SocialLinkData[];
  footerLegal?: string;
  labels: SiteLabels;
}

type Raw = {
  siteTitle?: string | null;
  description?: string | null;
  logo?: Parameters<typeof imageProps>[0];
  logoLight?: Parameters<typeof imageProps>[0];
  navigation?: { label?: string | null; href?: string | null }[] | null;
  membershipBand?: {
    heading?: string | null;
    body?: string | null;
    buttonLabel?: string | null;
    price?: string | null;
    href?: string | null;
    hiddenOnPaths?: string[] | null;
  } | null;
  footerHeading?: string | null;
  footerText?: string | null;
  supportLink?: { label?: string | null; href?: string | null } | null;
  socialLinks?: { label?: string | null; href?: string | null; icon?: string | null }[] | null;
  footerLegal?: string | null;
  labels?: Record<string, unknown> | null;
} | null;

const ICONS = ["whatsapp", "instagram", "mail", "donate"];

/** Labels for the image overlay, or null if they are not configured (the overlay is then disabled). */
export function lightboxLabels(labels: SiteLabels): { close: string; previous: string; next: string; dialog: string } | null {
  const { lightboxClose: close, lightboxPrev: previous, lightboxNext: next, lightboxDialog: dialog } = labels;
  return close && previous && next && dialog ? { close, previous, next, dialog } : null;
}

/** Site-wide settings from Sanity. Every text, link, label and logo shown in the shell comes from here. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const raw = await safeFetch<Raw>(SITE_SETTINGS_QUERY, {}, null);
  const labels: SiteLabels = {};
  for (const [k, v] of Object.entries(raw?.labels ?? {})) if (typeof v === "string" && v) labels[k] = v;
  const band = raw?.membershipBand;
  return {
    siteTitle: raw?.siteTitle ?? undefined,
    description: raw?.description ?? undefined,
    logo: imageProps(raw?.logo, { width: 192 }),
    logoLight: imageProps(raw?.logoLight, { width: 192 }),
    navigation: (raw?.navigation ?? []).flatMap((n) => (n.label && n.href ? [{ label: n.label, href: n.href }] : [])),
    membershipBand: band
      ? {
          heading: band.heading ?? undefined,
          body: band.body ?? undefined,
          buttonLabel: band.buttonLabel ?? undefined,
          price: band.price ?? undefined,
          href: band.href ?? undefined,
          hiddenOnPaths: band.hiddenOnPaths ?? [],
        }
      : null,
    footerHeading: raw?.footerHeading ?? undefined,
    footerText: raw?.footerText ?? undefined,
    supportLink:
      raw?.supportLink?.label && raw.supportLink.href
        ? { label: raw.supportLink.label, href: raw.supportLink.href }
        : null,
    socialLinks: (raw?.socialLinks ?? []).flatMap((s) =>
      s.label && s.href && s.icon && ICONS.includes(s.icon)
        ? [{ label: s.label, href: s.href, icon: s.icon as SocialLinkData["icon"] }]
        : [],
    ),
    footerLegal: raw?.footerLegal ?? undefined,
    labels,
  };
}
