import Image from "next/image";
import { Button, Section, SectionHeading, SectionLabel, type SectionTone } from "@/components/ui";
import type { InstagramPost } from "./instagram";

export interface InstagramFeedProps {
  eyebrow?: string;
  heading: string;
  /** Shown when no posts could be loaded. */
  blurb?: string;
  buttonLabel?: string;
  profileUrl: string;
  /** Alt text for posts without a caption. */
  altFallback?: string;
  posts?: InstagramPost[];
  tone?: SectionTone;
}

export function InstagramFeed({
  eyebrow,
  heading,
  blurb,
  buttonLabel,
  profileUrl,
  altFallback = "",
  posts = [],
  tone,
}: InstagramFeedProps) {
  return (
    <Section divider tone={tone} innerClassName="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
        <SectionHeading>{heading}</SectionHeading>
      </div>
      {posts.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-6">
          {posts.map((p) => (
            <li key={p.id}>
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-square overflow-hidden rounded-ds transition-opacity duration-400 ease-ds hover:opacity-85 active:opacity-70"
              >
                <Image
                  src={p.imageUrl}
                  alt={p.caption.slice(0, 120) || altFallback}
                  fill
                  unoptimized
                  sizes="(min-width: 810px) 33vw, 50vw"
                  className="object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : blurb ? (
        <p className="max-w-[720px] text-body text-secondary">{blurb}</p>
      ) : null}
      {buttonLabel ? (
        <div>
          <Button href={profileUrl} variant="secondary">
            {buttonLabel}
          </Button>
        </div>
      ) : null}
    </Section>
  );
}
