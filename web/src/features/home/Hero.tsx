import Image from "next/image";
import { Button, SectionHeading, SectionLabel, Section } from "@/components/ui";

const DEFAULT_IMAGE = {
  src: "https://framerusercontent.com/images/yus7k8ig8KjhW0sSpjxWEiLcnA.jpg",
  alt: "Representative abstract painting; temporary artwork pending original image upload",
};

export interface HeroProps {
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  cta?: { label: string | null; href: string | null } | null;
  image?: { src: string; alt: string } | null;
}

export function Hero({ eyebrow, heading, subheading, cta, image }: HeroProps = {}) {
  const img = image ?? DEFAULT_IMAGE;
  return (
    <Section innerClassName="flex flex-col items-stretch gap-8 tablet:flex-row tablet:items-center tablet:gap-12">
      <div className="flex flex-1 flex-col items-start gap-6">
        <SectionLabel>{eyebrow || "By artists. For artists. With community."}</SectionLabel>
        <SectionHeading as="h1">{heading || "Your art has a story. Let’s help it travel further."}</SectionHeading>
        <p className="text-body text-secondary">
          {subheading ||
            "Join a growing network of Indian-origin visual artists creating, exhibiting, and building community across the United States."}
        </p>
        <Button href={cta?.href || "https://www.indianamericanartists.org/membership"}>
          {cta?.label || "Become a member"}
        </Button>
      </div>
      <div className="relative h-[320px] flex-1 overflow-hidden rounded-ds tablet:h-[480px]">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          priority
          sizes="(min-width: 810px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </Section>
  );
}
