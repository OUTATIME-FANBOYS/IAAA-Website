import { PortableText } from "next-sanity";
import {
  Button,
  EditorialCard,
  EditorialLink,
  InfoCardGrid,
  PageHero,
  Section,
  SectionHeading,
  SectionLabel,
  SmartLink,
} from "@/components/ui";
import { FoundersSection, QuotesSection } from "@/features/about";
import { EventCard, getEvents } from "@/features/events";
import { ChannelsSection } from "@/features/giving";
import { InstagramFeed, MemberNews, WaysToGetInvolved, getInstagramPosts } from "@/features/home";
import { MemberDirectory, getFounders, getMembers, groupLabels } from "@/features/members";
import { ChecklistSection, PricingSection } from "@/features/membership";
import { OrgChartSection, getOrgStructure } from "@/features/org";
import { imageProps } from "@/sanity/lib/image";
import { getSiteSettings } from "@/sanity/lib/settings";
import { cta, type PageSection, type SectionOf } from "./types";

const clean = <T,>(list: (T | null | undefined)[] | null | undefined): T[] =>
  (list ?? []).filter((x): x is T => x != null);

async function Directory({ s }: { s: SectionOf<"memberDirectorySection"> }) {
  const [members, settings] = await Promise.all([getMembers(), getSiteSettings()]);
  const founders = members
    .filter((m) => m.isFounder)
    .sort((a, b) => (a.founderOrder ?? 9999) - (b.founderOrder ?? 9999) || a.name.localeCompare(b.name));
  return (
    <>
      <Section divider tone={s.tone ?? undefined}>
        <MemberDirectory
          members={members}
          allLabel={s.allLabel ?? ""}
          groupLabels={groupLabels(settings.labels)}
          countLabel={s.countLabel ?? undefined}
          emptyText={s.emptyText ?? undefined}
        />
      </Section>
      {founders.length > 0 ? (
        <Section divider tone={s.foundersTone ?? undefined} innerClassName="flex flex-col gap-8">
          {s.foundersEyebrow ? <SectionLabel>{s.foundersEyebrow}</SectionLabel> : null}
          {s.foundersHeading ? <SectionHeading>{s.foundersHeading}</SectionHeading> : null}
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
            {founders.map((m) => (
              <li key={m.slug}>
                <EditorialCard href={`/members/${m.slug}`} title={m.name}>
                  {[m.role, m.medium, m.location].filter(Boolean).join(" · ")}
                </EditorialCard>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

async function EventList({ s }: { s: SectionOf<"eventListSection"> }) {
  const events = await getEvents();
  return (
    <Section divider tone={s.tone ?? undefined} innerClassName="flex flex-col gap-8">
      {s.eyebrow || s.heading ? (
        <div className="flex flex-col gap-4">
          {s.eyebrow ? <SectionLabel>{s.eyebrow}</SectionLabel> : null}
          {s.heading ? <SectionHeading>{s.heading}</SectionHeading> : null}
        </div>
      ) : null}
      {events.length === 0 ? (
        s.emptyText ? <p className="text-body text-secondary">{s.emptyText}</p> : null
      ) : (
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-3">
          {events.map((e) => (
            <li key={e.slug}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

async function Founders({ s }: { s: SectionOf<"foundersSection"> }) {
  return (
    <FoundersSection
      eyebrow={s.eyebrow ?? undefined}
      heading={s.heading ?? ""}
      cardCaption={s.cardCaption ?? undefined}
      link={cta(s.link)}
      founders={await getFounders()}
      tone={s.tone ?? undefined}
    />
  );
}

async function Instagram({ s }: { s: SectionOf<"instagramSection"> }) {
  if (!s.profileUrl) return null;
  const posts = await getInstagramPosts(s.postCount ?? 6);
  return (
    <InstagramFeed
      eyebrow={s.eyebrow ?? undefined}
      heading={s.heading ?? ""}
      blurb={s.blurb ?? undefined}
      buttonLabel={s.buttonLabel ?? undefined}
      profileUrl={s.profileUrl}
      altFallback={s.altFallback ?? undefined}
      posts={posts}
      tone={s.tone ?? undefined}
    />
  );
}

async function OrgChart({ s }: { s: SectionOf<"orgChartSection"> }) {
  return (
    <OrgChartSection
      org={await getOrgStructure()}
      copy={{
        eyebrow: s.eyebrow ?? undefined,
        heading: s.heading ?? undefined,
        tagline: s.tagline ?? undefined,
        mission: s.mission ?? undefined,
        missionLabel: s.missionLabel ?? undefined,
        coreLabel: s.coreLabel ?? undefined,
        coreNote: s.coreNote ?? undefined,
        advisoryLabel: s.advisoryLabel ?? undefined,
        advisoryNote: s.advisoryNote ?? undefined,
        standingLabel: s.standingLabel ?? undefined,
        standingNote: s.standingNote ?? undefined,
        popupEyebrow: s.popupEyebrow ?? undefined,
        popupHeading: s.popupHeading ?? undefined,
      }}
      tone={s.tone ?? undefined}
      popupTone={s.popupTone ?? undefined}
    />
  );
}

function Block({ section: s, first }: { section: PageSection; first: boolean }) {
  switch (s._type) {
    case "hero": {
      const image = imageProps(s.image) ?? (s.imageUrl ? { src: s.imageUrl, alt: s.imageAlt ?? "" } : null);
      return (
        <PageHero
          eyebrow={s.eyebrow ?? undefined}
          heading={s.heading ?? ""}
          subheading={s.subheading ?? undefined}
          cta={cta(s.cta)}
          secondaryLink={cta(s.secondaryLink)}
          chips={clean(s.chips)}
          image={image}
          align={s.align ?? "left"}
          background={imageProps(s.background, { width: 2000 })}
          backgroundOpacity={s.backgroundOpacity ?? undefined}
        />
      );
    }
    case "newsSection":
      return (
        <MemberNews
          eyebrow={s.eyebrow ?? undefined}
          heading={s.heading ?? undefined}
          items={clean(s.items).flatMap((i) => (i.title && i.url ? [{ title: i.title, href: i.url }] : []))}
          tone={s.tone ?? undefined}
        />
      );
    case "instagramSection":
      return <Instagram s={s} />;
    case "waysSection":
      return (
        <WaysToGetInvolved
          heading={s.heading ?? ""}
          cards={clean(s.cards).flatMap((c) =>
            c.title ? [{ title: c.title, body: c.body ?? undefined, button: cta(c.button) }] : [],
          )}
          footerLink={cta(s.footerLink)}
          tone={s.tone ?? undefined}
        />
      );
    case "quotesSection":
      return (
        <QuotesSection
          quotes={clean(s.quotes).flatMap((q) => (q.label && q.text ? [{ label: q.label, text: q.text }] : []))}
          tone={s.tone ?? undefined}
        />
      );
    case "featureGrid":
      return (
        <Section divider={!first} tone={s.tone ?? undefined} innerClassName="flex flex-col gap-8">
          {s.eyebrow || s.heading || s.intro ? (
            <div className="flex flex-col items-start gap-4">
              {s.eyebrow ? <SectionLabel>{s.eyebrow}</SectionLabel> : null}
              {s.heading ? <SectionHeading>{s.heading}</SectionHeading> : null}
              {s.intro ? <p className="max-w-[720px] text-body text-secondary">{s.intro}</p> : null}
            </div>
          ) : null}
          <InfoCardGrid
            columns={s.columns === 3 ? 3 : 4}
            items={clean(s.features).flatMap((f) =>
              f.title ? [{ title: f.title, description: f.description ?? undefined, tag: f.tag ?? undefined }] : [],
            )}
          />
        </Section>
      );
    case "foundersSection":
      return <Founders s={s} />;
    case "checklistSection":
      return (
        <ChecklistSection
          eyebrow={s.eyebrow ?? undefined}
          heading={s.heading ?? ""}
          intro={s.intro ?? undefined}
          items={clean(s.items).flatMap((i) => (i.title ? [{ title: i.title, description: i.description ?? undefined }] : []))}
          tone={s.tone ?? undefined}
        />
      );
    case "pricingSection":
      return (
        <PricingSection
          label={s.label ?? undefined}
          title={s.title ?? ""}
          price={s.price ?? ""}
          priceUnit={s.priceUnit ?? undefined}
          body={s.body ?? undefined}
          notesHeading={s.notesHeading ?? undefined}
          notes={clean(s.notes)}
          cta={cta(s.cta)}
          tone={s.tone ?? undefined}
        />
      );
    case "channelsSection":
      return (
        <ChannelsSection
          eyebrow={s.eyebrow ?? undefined}
          heading={s.heading ?? undefined}
          tone={s.tone ?? undefined}
          channels={clean(s.channels).flatMap((c) =>
            c.title
              ? [
                  {
                    title: c.title,
                    body: c.body ?? undefined,
                    note: c.note ?? undefined,
                    panel: c.panel
                      ? {
                          heading: c.panel.heading ?? undefined,
                          lines: clean(c.panel.lines),
                          monospace: c.panel.monospace ?? false,
                          copyValue: c.panel.copyValue ?? undefined,
                          copyLabel: c.panel.copyLabel ?? undefined,
                          copiedLabel: c.panel.copiedLabel ?? undefined,
                          footnote: c.panel.footnote ?? undefined,
                          footnoteLink: cta(c.panel.footnoteLink),
                        }
                      : undefined,
                    button: cta(c.button),
                    link: cta(c.link),
                  },
                ]
              : [],
          )}
        />
      );
    case "orgChartSection":
      return <OrgChart s={s} />;
    case "memberDirectorySection":
      return <Directory s={s} />;
    case "eventListSection":
      return <EventList s={s} />;
    case "linkListSection":
      return (
        <Section divider={!first} tone={s.tone ?? undefined} innerClassName="flex max-w-[720px] flex-col items-start gap-6">
          {s.eyebrow ? <SectionLabel>{s.eyebrow}</SectionLabel> : null}
          {s.heading ? <SectionHeading>{s.heading}</SectionHeading> : null}
          {s.body ? <p className="text-body text-secondary">{s.body}</p> : null}
          <ul className="flex flex-col gap-4">
            {clean(s.links).map((l) =>
              l.href && l.label ? (
                <li key={l._key}>
                  <EditorialLink href={l.href}>{l.label}</EditorialLink>
                </li>
              ) : null,
            )}
          </ul>
        </Section>
      );
    case "richTextSection":
      return (
        <Section divider={!first} tone={s.tone ?? undefined} innerClassName="flex max-w-[720px] flex-col items-start gap-6">
          {s.eyebrow ? <SectionLabel>{s.eyebrow}</SectionLabel> : null}
          {s.heading ? <SectionHeading>{s.heading}</SectionHeading> : null}
          {s.body ? (
            <div className="flex flex-col gap-4 text-body text-secondary">
              <PortableText
                value={s.body}
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
          ) : null}
        </Section>
      );
    case "ctaSection":
      return (
        <Section divider={!first} tone={s.tone ?? undefined} innerClassName="flex max-w-[720px] flex-col items-start gap-6">
          {s.heading ? <SectionHeading>{s.heading}</SectionHeading> : null}
          {s.text ? <p className="text-body text-secondary">{s.text}</p> : null}
          {cta(s.cta) ? <Button href={s.cta!.href as string}>{s.cta!.label}</Button> : null}
        </Section>
      );
    default:
      return null;
  }
}

/** Renders a page's sections in order. Every text, label and image comes from the section data. */
export function PageBuilder({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <Block key={s._key} section={s} first={i === 0} />
      ))}
    </>
  );
}
