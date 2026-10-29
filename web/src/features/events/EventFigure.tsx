import Image from "next/image";
import { LightboxTrigger } from "@/components/ui";
import type { EventImage } from "./data";

/** Image with italic caption and small credit line. Opens in the image overlay when `lightboxIndex` is given. */
export function EventFigure({ image, lightboxIndex }: { image: EventImage; lightboxIndex?: number }) {
  const picture = (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width ?? 800}
      height={image.height ?? 1000}
      sizes="(min-width: 810px) 40vw, 100vw"
      className="h-auto w-full rounded-ds"
    />
  );
  return (
    <figure className="flex flex-col gap-3">
      {lightboxIndex === undefined ? (
        picture
      ) : (
        <LightboxTrigger index={lightboxIndex} label={image.caption ?? image.alt}>
          {picture}
        </LightboxTrigger>
      )}
      {image.caption || image.credit ? (
        <figcaption className="flex flex-col gap-1">
          {image.caption ? <span className="text-meta font-medium italic text-primary">{image.caption}</span> : null}
          {image.credit ? <span className="text-[0.8125rem] text-caption">{image.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
