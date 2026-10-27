import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import { Button, EditorialLink, Section, SectionHeading, SectionLabel, SmartLink } from "@/components/ui";

type Props = { params: Promise<{ slug?: string[] }> };

async function getPage(params: Props["params"]) {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug: slug?.join("/") || "home" },
  });
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPage(params);
  return {
    title: page?.seo?.title ?? page?.title,
    description: page?.seo?.description ?? undefined,
  };
}

export default async function Page({ params }: Props) {
  const page = await getPage(params);
  if (!page) notFound();

  const blocks = page.pageBuilder ?? [];
  return (
    <main className="flex-1">
      {blocks.map((block, i) => {
        const Heading = ({ children }: { children: string }) => (
          <SectionHeading as={i === 0 ? "h1" : "h2"}>{children}</SectionHeading>
        );
        switch (block._type) {
          case "richTextSection":
            return (
              <Section key={block._key} divider={i > 0} innerClassName="flex max-w-[720px] flex-col gap-6">
                {block.heading && <Heading>{block.heading}</Heading>}
                {block.body && (
                  <div className="flex flex-col gap-4 text-body text-secondary">
                    <PortableText
                      value={block.body}
                      components={{
                        marks: {
                          link: ({ value, children }) => (
                            <SmartLink href={value?.href ?? "#"} className="font-semibold text-burgundy underline underline-offset-4">
                              {children}
                            </SmartLink>
                          ),
                        },
                      }}
                    />
                  </div>
                )}
              </Section>
            );
          case "linkListSection":
            return (
              <Section key={block._key} divider={i > 0} innerClassName="flex max-w-[720px] flex-col gap-6">
                {block.eyebrow && <SectionLabel>{block.eyebrow}</SectionLabel>}
                {block.heading && <Heading>{block.heading}</Heading>}
                {block.body && <p className="text-body text-secondary">{block.body}</p>}
                <ul className="flex flex-col gap-4">
                  {block.links?.map((l) =>
                    l.href ? (
                      <li key={l._key}>
                        <EditorialLink href={l.href}>{l.label}</EditorialLink>
                      </li>
                    ) : null,
                  )}
                </ul>
              </Section>
            );
          case "featureGrid":
            return (
              <Section key={block._key} divider={i > 0} innerClassName="flex flex-col gap-8">
                {block.heading && <Heading>{block.heading}</Heading>}
                <div className="grid gap-6 tablet:grid-cols-3">
                  {block.features?.map((f) => (
                    <div key={f._key} className="flex flex-col gap-2">
                      <h3 className="font-serif text-xl text-primary">{f.title}</h3>
                      <p className="text-body text-secondary">{f.description}</p>
                    </div>
                  ))}
                </div>
              </Section>
            );
          case "ctaSection":
            return (
              <Section key={block._key} divider={i > 0} innerClassName="flex max-w-[720px] flex-col items-start gap-6">
                {block.heading && <Heading>{block.heading}</Heading>}
                {block.text && <p className="text-body text-secondary">{block.text}</p>}
                {block.cta?.href && <Button href={block.cta.href}>{block.cta.label}</Button>}
              </Section>
            );
          case "hero":
            return (
              <Section key={block._key} divider={i > 0} innerClassName="flex max-w-[720px] flex-col items-start gap-6">
                {block.eyebrow && <SectionLabel>{block.eyebrow}</SectionLabel>}
                <SectionHeading as="h1">{block.heading}</SectionHeading>
                {block.subheading && <p className="text-body text-secondary">{block.subheading}</p>}
                {block.cta?.href && <Button href={block.cta.href}>{block.cta.label}</Button>}
              </Section>
            );
          default:
            return null;
        }
      })}
    </main>
  );
}
