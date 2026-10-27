import { Button } from "./Button";
import { SectionHeading } from "./SectionHeading";

export interface MembershipBandProps {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function MembershipBand({
  heading = "Find the community that helps you grow.",
  body = "Create, exhibit, collaborate, and celebrate with Indian-origin visual artists across the United States.",
  ctaLabel = "Become a member · $50 / year",
  ctaHref = "/membership",
}: MembershipBandProps) {
  return (
    <section className="bg-burgundy px-6 py-10 tablet:px-8 tablet:py-16">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 text-center">
        <SectionHeading inverse className="max-w-[800px]">
          {heading}
        </SectionHeading>
        <p className="max-w-[720px] text-body text-white">{body}</p>
        <Button href={ctaHref} variant="inverse">
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
