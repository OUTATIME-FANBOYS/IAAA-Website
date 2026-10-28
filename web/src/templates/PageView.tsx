import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/settings";
import { PageBuilder } from "./PageBuilder";
import type { PageSection } from "./types";

async function getPage(slug: string) {
  const { data } = await sanityFetch({ query: PAGE_QUERY, params: { slug } });
  return data;
}

/** Page title and description: the page's SEO fields, with the page title as the fallback. */
export async function pageMetadata(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSiteSettings()]);
  if (!page) return {};
  const site = settings.siteTitle;
  return {
    title: page.seo?.title ?? [page.title, site].filter(Boolean).join(" | "),
    description: page.seo?.description ?? settings.description,
  };
}

/** A CMS page: fetches the page document with this slug and renders its page builder. */
export async function PageView({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  // sanityFetch types strings as stega-encoded; at runtime they are plain strings outside visual editing.
  return <PageBuilder sections={(page.pageBuilder ?? []) as unknown as PageSection[]} />;
}
