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
}: PageHeroProps) {
  const centered = align === "center" && !image;
  const text = (
    <div className={cn("flex flex-1 flex-col gap-6", centered ? "items-center text-center" : "items-start")}>
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
      innerClassName={cn(
        "flex flex-col items-stretch gap-8",
        image && "tablet:flex-row tablet:items-center tablet:gap-12",
      )}
    >
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
