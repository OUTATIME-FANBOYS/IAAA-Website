import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { getSiteSettings } from "@/sanity/lib/settings";
import { getFounders } from "@/features/members";
import { HideOnRoutes, MembershipBand, SiteFooter, SiteHeader } from "@/features/site-shell";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// The site title is the only text with a built-in fallback (used if the CMS is unreachable).
const FALLBACK_TITLE = "Indian American Artists Association";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteTitle ?? FALLBACK_TITLE,
    description: settings.description,
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, founders] = await Promise.all([getSiteSettings(), getFounders()]);
  const { labels, membershipBand: band } = settings;
  const siteName = settings.siteTitle ?? FALLBACK_TITLE;

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader
          siteName={siteName}
          links={settings.navigation}
          logo={settings.logo}
          logoLight={settings.logoLight}
          founders={founders}
          menuLabels={labels.menuOpen && labels.menuClose ? { open: labels.menuOpen, close: labels.menuClose } : undefined}
          membersMenu={{
            label: labels.membersMenuLabel ?? "",
            all: labels.membersMenuAll,
            org: labels.membersMenuOrg,
            orgHref: labels.membersMenuOrgHref,
            founders: labels.membersMenuFounders,
          }}
        />
        <main className="flex-1">{children}</main>
        {band?.heading ? (
          <HideOnRoutes paths={band.hiddenOnPaths}>
            <MembershipBand
              heading={band.heading}
              body={band.body}
              ctaLabel={[band.buttonLabel, band.price].filter(Boolean).join(" · ") || undefined}
              ctaHref={band.href}
            />
          </HideOnRoutes>
        ) : null}
        <SiteFooter
          title={settings.footerHeading}
          tagline={settings.footerText}
          supportLink={settings.supportLink}
          socials={settings.socialLinks}
          caption={settings.footerLegal}
          logo={settings.logoLight}
          homeLabel={siteName}
        />
        <SanityLive />
      </body>
    </html>
  );
}
