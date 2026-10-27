import { Button, EditorialCard, EditorialLink, Section, SectionHeading, SectionLabel } from "@/components/ui";
import { MEMBER_GROUP_LABELS, type Member } from "@/lib/members";

export function MemberProfile({ member }: { member: Member }) {
  const initials = member.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <>
      <Section innerClassName="flex flex-col gap-8">
        <nav aria-label="Breadcrumb">
          <EditorialLink href="/members">&larr; All members</EditorialLink>
        </nav>
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-start tablet:gap-12">
          <div className="flex flex-1 flex-col gap-4">
            {member.portraitUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.portraitUrl}
                alt={`Portrait of ${member.name}`}
                className="h-80 w-full rounded-ds object-cover tablet:h-[480px]"
              />
            ) : (
              <div
                role="img"
                aria-label={`Portrait placeholder for ${member.name}`}
                className="flex h-80 w-full items-center justify-center rounded-ds border border-subtle font-serif text-display text-subtle tablet:h-[480px]"
              >
                {initials}
              </div>
            )}
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
          <div className="flex flex-1 flex-col gap-6">
            <SectionLabel>{member.role ?? MEMBER_GROUP_LABELS[member.group]}</SectionLabel>
            <SectionHeading as="h1">{member.name}</SectionHeading>
            {(member.medium || member.location) && (
              <p className="text-meta text-caption">
                {[member.medium, member.location].filter(Boolean).join(" · ")}
              </p>
            )}
            {member.bio.map((p, i) => (
              <p key={i} className="text-body text-secondary">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section divider innerClassName="flex flex-col gap-8">
        <SectionLabel>Featured work</SectionLabel>
        <SectionHeading>Selected artworks</SectionHeading>
        {member.featuredWork.length === 0 ? (
          <p className="text-body text-secondary">No featured work has been added yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
            {member.featuredWork.map((a) => (
              <li key={a.title} className="flex flex-col gap-3">
                <div
                  aria-hidden="true"
                  className="h-60 w-full rounded-ds border border-subtle bg-paper"
                />
                <span className="font-serif text-card font-medium text-primary">{a.title}</span>
                <span className="text-meta text-caption">
                  {[a.medium, a.year].filter(Boolean).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section divider innerClassName="flex flex-col gap-8">
        <SectionLabel>Appearances</SectionLabel>
        <SectionHeading>Also showing in</SectionHeading>
        {member.events.length === 0 ? (
          <p className="text-body text-secondary">Not currently listed in any events.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-8 tablet:grid-cols-2 desktop:grid-cols-4">
            {member.events.map((e) => (
              <li key={e.href + e.title}>
                <EditorialCard href={e.href} title={e.title} />
              </li>
            ))}
          </ul>
        )}
        <div>
          <Button href="/members" variant="secondary">
            Back to member directory
          </Button>
        </div>
      </Section>
    </>
  );}
