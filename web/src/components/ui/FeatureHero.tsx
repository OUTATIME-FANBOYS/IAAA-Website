import Image from "next/image";
import type { ReactNode } from "react";

export interface FeatureHeroProps {
  /** Small uppercase line above the title, shown after an em dash. */
  label: string;
  title: string;
  /** Full-bleed cover. Without it the hero is a solid tinted band. */
  image?: { src: string; alt: string } | null;
  /** Extra lines under the title (date, summary, ...). */
  children?: ReactNode;
}

/** Full-bleed cover with a floating burgundy title card (top-right on tablet+, overlapping on phone). */
export function FeatureHero({ label, title, image, children }: FeatureHeroProps) {
  return (
    <section className="relative">
      <div className="relative h-[200px] w-full overflow-hidden bg-pacific/40 tablet:h-[320px]">
        {image ? (
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
        ) : null}
      </div>
      <div className="px-6 tablet:absolute tablet:inset-x-0 tablet:top-0 tablet:px-8">
        <div className="mx-auto flex max-w-content justify-end">
          <div className="-mt-10 flex w-full flex-col gap-4 rounded-ds bg-burgundy p-6 text-white tablet:mt-12 tablet:w-[420px] tablet:p-8">
            <p className="text-label font-semibold uppercase">— {label}</p>
            <h1 className="font-serif text-[1.75rem] font-semibold leading-tight tablet:text-[2rem]">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
