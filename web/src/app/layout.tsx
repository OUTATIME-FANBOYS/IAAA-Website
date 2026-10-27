import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SanityLive, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { getFounders } from "@/lib/members";
import { HideOnHome, MembershipBand, SiteFooter, SiteHeader } from "@/components/ui";

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

export const metadata: Metadata = {
  title: "Indian American Artists Association",
  description:
    "A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const founders = await getFounders();
  const navLinks = settings?.navigation?.length
    ? settings.navigation.map((item) => ({
        label: item.label ?? "",
        href: item.href ?? "/",
      }))
    : undefined;

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader siteName={settings?.siteTitle ?? undefined} links={navLinks} founders={founders} />
        <main className="flex-1">{children}</main>
        <HideOnHome>
          <MembershipBand />
        </HideOnHome>
        <SiteFooter caption={settings?.footerText ?? undefined} />
        <SanityLive />
      </body>
    </html>
  );
}
