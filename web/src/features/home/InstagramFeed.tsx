import Image from "next/image";
import { Button, Section, SectionHeading, SectionLabel } from "@/components/ui";
import { INSTAGRAM_PROFILE_URL, type InstagramPost } from "./instagram";

export interface InstagramFeedProps {
  posts?: InstagramPost[];
}

export function InstagramFeed({ posts = [] }: InstagramFeedProps) {
  return (
    <Section divider className="bg-pacific/15" innerClassName="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        <SectionLabel>On Instagram</SectionLabel>
        <SectionHeading>Follow @artistsiaaa</SectionHeading>
      </div>
      {posts.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-3 tablet:gap-6">
          {posts.map((p) => (
            <li key={p.id}>
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-square overflow-hidden rounded-ds transition-opacity duration-400 ease-ds hover:opacity-85"
              >
                <Image
                  src={p.imageUrl}
                  alt={p.caption.slice(0, 120) || "Post from @artistsiaaa on Instagram"}
                  fill
                  unoptimized
                  sizes="(min-width: 810px) 33vw, 50vw"
                  className="object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[720px] text-body text-secondary">
          See studio visits, exhibition openings, and member work as it happens.
        </p>
      )}
      <div>
        <Button href={INSTAGRAM_PROFILE_URL} variant="secondary">
          Follow on Instagram
        </Button>
      </div>
    </Section>
  );
}
