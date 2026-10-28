import { Button, SectionHeading } from "@/components/ui";

export interface MembershipBandProps {
  heading: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function MembershipBand({ heading, body, ctaLabel, ctaHref }: MembershipBandProps) {
  return (
    <section className="bg-burgundy px-6 py-10 tablet:px-8 tablet:py-16">
      <div className="mx-auto flex max-w-content flex-col items-center gap-6 text-center">
        <SectionHeading inverse className="max-w-[800px]">
          {heading}
        </SectionHeading>
        {body ? <p className="max-w-[720px] text-body text-white">{body}</p> : null}
        {ctaLabel && ctaHref ? (
          <Button href={ctaHref} variant="inverse">
            {ctaLabel}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
