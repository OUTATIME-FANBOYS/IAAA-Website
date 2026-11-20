import Image from "next/image";
import { PortableText } from "next-sanity";
import {
  EditorialLink,
  LightboxGroup,
  LightboxTrigger,
  Section,
  SectionHeading,
  SectionLabel,
  SmartLink,
  type LightboxImage,
} from "@/components/ui";
import { lightboxLabels, type SiteLabels } from "@/sanity/lib/settings";
import type { ProjectReport } from "./data";

/**
 * Long-form project report on the event page. Renders nothing unless the report has a title or an intro;
 * each further part (figures, sections, gallery, press, credits) is hidden when it is empty.
 */
export function ProjectReportSection({ report, labels }: { report?: ProjectReport; labels: SiteLabels }) {
  if (!report || (!report.title && !report.intro)) return null;
  const viewerLabels = lightboxLabels(labels) ?? { close: "", previous: "", next: "", dialog: "" };
  const images: LightboxImage[] = report.gallery.map((g) => ({
    src: g.fullSrc ?? g.src,
    alt: g.alt,
    title: g.caption,
    details: g.credit,
  }));

  return (
    <Section divider tone="blossom" innerClassName="flex flex-col gap-12 min-w-0">
      <header className="flex max-w-[720px] flex-col gap-4">
        {labels.reportLabel ? <SectionLabel>{labels.reportLabel}</SectionLabel> : null}
        {report.title ? <SectionHeading>{report.title}</SectionHeading> : null}
        {report.intro ? <p className="text-body text-secondary">{report.intro}</p> : null}
      </header>

      {report.keyFigures.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          {report.keyFigures.map((k) => (
            <li key={`${k.label}-${k.value}`} className="flex min-w-0 flex-col gap-2 rounded-ds border border-subtle bg-white/70 p-5">
              <span className="font-serif text-card font-medium text-burgundy break-words">{k.value}</span>
              <span className="text-meta text-caption break-words">{k.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {report.sections.length > 0 ? (
        <div className="flex max-w-[720px] flex-col gap-10">
          {report.sections.map((s, i) => (
            <div key={i} className="flex flex-col gap-4">
              {s.heading ? <h3 className="font-serif text-card font-medium text-primary break-words">{s.heading}</h3> : null}
              {s.body.length > 0 ? (
                <div className="flex flex-col gap-4 break-words text-body text-secondary">
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
              {s.pullQuote ? (
                <blockquote className="border-l-2 border-burgundy pl-6 font-serif text-card font-semibold text-burgundy">
                  {s.pullQuote}
                </blockquote>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {report.gallery.length > 0 ? (
        <LightboxGroup images={images} labels={viewerLabels}>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-6 tablet:grid-cols-3">
            {report.gallery.map((g, i) => (
              <li key={`${g.src}-${i}`} className="flex min-w-0 flex-col gap-2">
                <LightboxTrigger index={i} label={g.caption ?? g.alt}>
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-ds">
                    <Image src={g.src} alt={g.alt} fill sizes="(min-width: 810px) 25vw, 50vw" className="object-cover" />
                  </span>
                </LightboxTrigger>
                {g.caption || g.credit ? (
                  <span className="flex flex-col gap-1 break-words">
                    {g.caption ? <span className="text-meta font-medium italic text-primary">{g.caption}</span> : null}
                    {g.credit ? <span className="text-[0.8125rem] text-caption">{g.credit}</span> : null}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </LightboxGroup>
      ) : null}

      {report.pressLinks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {labels.reportPressHeading ? <h3 className="font-serif text-card font-medium text-primary">{labels.reportPressHeading}</h3> : null}
          <ul className="flex flex-col gap-3">
            {report.pressLinks.map((l) => (
              <li key={`${l.label}-${l.href}`} className="break-words">
                <EditorialLink href={l.href}>{l.label}</EditorialLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {report.credits ? (
        <div className="flex max-w-[720px] flex-col gap-3 border-t border-subtle pt-8">
          {labels.reportCreditsHeading ? (
            <h3 className="font-serif text-card font-medium text-primary">{labels.reportCreditsHeading}</h3>
          ) : null}
          <p className="whitespace-pre-line break-words text-meta text-caption">{report.credits}</p>
        </div>
      ) : null}
    </Section>
  );
}
