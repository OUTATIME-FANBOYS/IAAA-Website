import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/ui";
import { ProfileForm, resolveInvite } from "@/features/onboarding";
import { getSiteSettings } from "@/sanity/lib/settings";

// A personal link: keep it out of search results and do not pass it on to other sites as a referrer.
export const metadata: Metadata = { robots: { index: false, follow: false }, referrer: "no-referrer" };

type Props = { searchParams: Promise<{ invite?: string | string[] }> };

export default async function ProfileFormPage({ searchParams }: Props) {
  const { invite: raw } = await searchParams;
  const token = Array.isArray(raw) ? raw[0] : raw;
  const [invite, settings] = await Promise.all([resolveInvite(token), getSiteSettings()]);
  const labels = settings.labels;

  return (
    <Section innerClassName="flex max-w-[720px] flex-col gap-8">
      {invite && token ? (
        <>
          <div className="flex flex-col gap-4">
            {labels.onboardTitle ? <SectionHeading>{labels.onboardTitle}</SectionHeading> : null}
            {labels.onboardIntro ? <p className="text-body text-secondary">{labels.onboardIntro}</p> : null}
          </div>
          <ProfileForm token={token} labels={labels} prefill={invite.prefill} hasExistingPhoto={invite.hasExistingPhoto} />
        </>
      ) : (
        <div className="flex flex-col gap-4">
          {labels.onboardInvalidTitle ? <SectionHeading>{labels.onboardInvalidTitle}</SectionHeading> : null}
          {labels.onboardInvalidBody ? <p className="text-body text-secondary">{labels.onboardInvalidBody}</p> : null}
        </div>
      )}
    </Section>
  );
}
