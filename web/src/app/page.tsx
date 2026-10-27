import type { Metadata } from "next";
import { Hero, InstagramFeed, MemberNews, WaysToGetInvolved } from "@/features/home";
import { getInstagramPosts } from "@/features/home";
import { imageProps } from "@/sanity/lib/image";
import { safeFetch } from "@/sanity/lib/fetch";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HOME_PAGE_QUERY_RESULT } from "@/../sanity.types";

const DEFAULT_TITLE = "Indian American Artists Association";
const DEFAULT_DESCRIPTION =
  "A community of Indian-origin visual artists creating, exhibiting, and building connections across the United States.";

const getHome = () => safeFetch<HOME_PAGE_QUERY_RESULT | null>(HOME_PAGE_QUERY, {}, null);

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHome();
  return {
    title: page?.seo?.title || DEFAULT_TITLE,
    description: page?.seo?.description || DEFAULT_DESCRIPTION,
  };
}

export default async function HomePage() {
  const page = await getHome();
  const blocks = page?.pageBuilder ?? [];
  const hero = blocks.find((b) => b._type === "hero");
  const news = blocks.find((b) => b._type === "newsSection");
  const posts = await getInstagramPosts(6);

  const cmsImage = hero?.image ? imageProps(hero.image, { width: 960, height: 960 }) : null;
  const heroImage = cmsImage ?? (hero?.imageUrl ? { src: hero.imageUrl, alt: hero.imageAlt ?? "" } : null);

  return (
    <>
      <Hero
        eyebrow={hero?.eyebrow}
        heading={hero?.heading}
        subheading={hero?.subheading}
        cta={hero?.cta}
        image={heroImage}
      />
      <MemberNews
        eyebrow={news?.eyebrow}
        heading={news?.heading}
        items={news?.items?.map((i) => ({ title: i.title, href: i.url }))}
      />
      <InstagramFeed posts={posts} />
      <WaysToGetInvolved />
    </>
  );
}
