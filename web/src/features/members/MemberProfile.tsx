import Image from "next/image";
import {
  ArtworkTile,
  Button,
  EditorialCard,
  EditorialLink,
  FeatureHero,
  LightboxGroup,
  Section,
  SectionHeading,
  SectionLabel,
  type LightboxImage,
} from "@/components/ui";
import { lightboxLabels, type SiteLabels } from "@/sanity/lib/settings";
import { groupLabels, type Member } from "./data";

export function MemberProfile({ member, labels }: { member: Member; labels: SiteLabels }) {
  const groups = groupLabels(labels);
  // Overlay images, in the same order as the tiles that have an image.
  const viewerImages: LightboxImage[] = [];
  const viewerIndex: (number | undefined)[] = member.featuredWork.map((a) => {
    if (!a.image) return undefined;
    viewerImages.push({
      src: a.fullSrc ?? a.image.src,
      alt: a.image.alt,
      title: a.title,
      details: [a.medium, a.dimensions, a.year].filter(Boolean).join(" · ") || undefined,
      description: a.description,
    });
    return viewerImages.length - 1;
  });
  const viewerLabels = lightboxLabels(labels) ?? { close: "", previous: "", next: "", dialog: "" };
  const initials = member.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const details = [member.medium, member.location].filter(Boolean).join(" · ");

  return (
    <>
      <FeatureHero label={member.role ?? groups[member.group]} title={member.name}>
        {details ? <p className="text-meta text-white/90">{details}</p> : null}
      </FeatureHero>

      <Section tone="blossom" innerClassName="flex flex-col gap-8">
        {labels.memberBack ? (
          <nav aria-label={labels.memberBack}>
            <EditorialLink href="/members">{labels.memberBack}</EditorialLink>
          </nav>
        ) : null}
        <div className="grid grid-cols-1 gap-10 tablet:grid-cols-12 tablet:items-start tablet:gap-12">
        <div className="flex flex-col gap-4 tablet:col-span-5 tablet:pr-6">
          <figure className="flex flex-col gap-3">
            {member.portraitUrl ? (
              <Image
                src={member.portraitUrl}
                alt={`Portrait of ${member.name}`}
                width={960}
                height={1200}
                sizes="(min-width: 810px) 40vw, 100vw"
                className="h-auto w-full rounded-ds"
              />
            ) : (
              <div
                role="img"
                aria-label={`Portrait placeholder for ${member.name}`}
                className="flex aspect-[4/5] w-full items-center justify-center rounded-ds border border-subtle bg-paper font-serif text-display text-subtle"
              >
                {initials}
              </div>
            )}
            <figcaption className="flex flex-col gap-1">
              <span className="text-meta font-medium italic text-primary">{member.name}</span>
              {details ? <span className="text-[0.8125rem] text-caption">{details}</span> : null}
            </figcaption>
          </figure>
          {member.videoUrl && labels.memberVideo ? (
            <EditorialLink href={member.videoUrl}>{labels.memberVideo}</EditorialLink>
          ) : null}
          {member.social.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {member.social.map((s) => (
                <li key={s.href}>
                  <EditorialLink href={s.href}>{s.label}</EditorialLink>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-6 tablet:col-span-7">
          {member.bio.length === 0 ? (
            labels.memberNoBio ? <p className="text-body text-secondary">{labels.memberNoBio}</p> : null
          ) : (
            member.bio.map((p, i) => (
              <p key={i} className="text-body text-secondary">
                {p}
              </p>
            ))
          )}
        </div>
        </div>
      </Section>

      <Section divider innerClassName="flex flex-col gap-8">
        {labels.memberFeaturedEyebrow ? <SectionLabel>{labels.memberFeaturedEyebrow}</SectionLabel> : null}
        {labels.memberFeaturedHeading ? <SectionHeading>{labels.memberFeaturedHeading}</SectionHeading> : null}
        {member.featuredWork.length === 0 ? (
          labels.memberNoWork ? <p className="text-body text-secondary">{labels.memberNoWork}</p> : null
        ) : (
          <LightboxGroup images={viewerImages} labels={viewerLabels}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 tablet:grid-cols-3 desktop:grid-cols-4">
              {member.featuredWork.map((a, i) => (
                <li key={`${a.title ?? "work"}-${i}`}>
                  <ArtworkTile
                    image={a.image}
                    title={a.title}
                    subtitle={[a.medium, a.dimensions, a.year].filter(Boolean).join(" · ") || undefined}
                    lightboxIndex={viewerIndex[i]}
                  />
                </li>
              ))}
            </ul>
          </LightboxGroup>
        )}
      </Section>

      <Section divider tone="pacific" innerClassName="flex flex-col gap-8">
        {labels.memberAppearancesEyebrow ? <SectionLabel>{labels.memberAppearancesEyebrow}</SectionLabel> : null}
        {labels.memberAppearancesHeading ? <SectionHeading>{labels.memberAppearancesHeading}</SectionHeading> : null}
        {member.events.length === 0 ? (
          labels.memberNoEvents ? <p className="text-body text-secondary">{labels.memberNoEvents}</p> : null
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
            {member.events.map((e) => (
              <li key={e.href + e.title}>
                <EditorialCard href={e.href} title={e.title} />
              </li>
            ))}
          </ul>
        )}
        {labels.memberBackToDirectory ? (
          <div>
            <Button href="/members" variant="secondary">
              {labels.memberBackToDirectory}
            </Button>
          </div>
        ) : null}
      </Section>
    </>
  );
}
