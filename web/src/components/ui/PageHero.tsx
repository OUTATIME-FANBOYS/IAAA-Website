import Image from "next/image";
import { Button } from "./Button";
import { EditorialLink } from "./EditorialLink";
import { Section } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { SectionLabel } from "./SectionLabel";
import { cn } from "./cn";

export interface PageHeroProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  cta?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
  chips?: string[];
  image?: { src: string; alt: string } | null;
  align?: "left" | "center";
  /** Decorative pattern faded behind the header. */
  background?: { src: string } | null;
  /** Background strength, 0 to 100 (default 14). */
  backgroundOpacity?: number;
}

/** Page header: eyebrow, title, intro, buttons, chips and an optional side image. */
export function PageHero({
  eyebrow,
  heading,
  subheading,
  cta,
  secondaryLink,
  chips = [],
  image,
  align = "left",
  background,
  backgroundOpacity = 14,
}: PageHeroProps) {
  const centered = align === "center" && !image;
  const text = (
    <div className={cn("relative flex flex-1 flex-col gap-6", centered ? "items-center text-center" : "items-start")}>
      {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
      <SectionHeading as="h1">{heading}</SectionHeading>
      {subheading ? <p className="max-w-[720px] text-body text-secondary">{subheading}</p> : null}
      {chips.length > 0 ? (
        <ul className={cn("flex flex-wrap gap-3", centered && "justify-center")}>
          {chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-subtle bg-white/60 px-4 py-1.5 text-[0.8125rem] font-medium text-primary"
            >
              {c}
            </li>
          ))}
        </ul>
      ) : null}
      {cta || secondaryLink ? (
        <div className={cn("flex flex-wrap items-center gap-6", centered && "justify-center")}>
          {cta ? <Button href={cta.href}>{cta.label}</Button> : null}
          {secondaryLink ? <EditorialLink href={secondaryLink.href}>{secondaryLink.label}</EditorialLink> : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <Section
      className={background ? "relative overflow-hidden" : undefined}
      innerClassName={cn(
        "flex flex-col items-stretch gap-8",
        image && "tablet:flex-row tablet:items-center tablet:gap-12",
      )}
    >
      {background ? (
        // Decorative: a faded pattern that fades out towards the bottom edge.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={background.src}
          alt=""
          aria-hidden="true"
          style={{ opacity: Math.min(Math.max(backgroundOpacity, 0), 100) / 100 }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        />
      ) : null}
      {text}
      {image ? (
        <div className="relative h-[320px] flex-1 overflow-hidden rounded-ds tablet:h-[480px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 810px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </Section>
  );
}
