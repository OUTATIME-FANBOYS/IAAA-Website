import Image from "next/image";
import type { EventImage } from "./data";

/** Image with italic caption and small credit line. */
export function EventFigure({ image }: { image: EventImage }) {
  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width ?? 800}
        height={image.height ?? 1000}
        sizes="(min-width: 810px) 40vw, 100vw"
        className="h-auto w-full rounded-ds"
      />
      {image.caption || image.credit ? (
        <figcaption className="flex flex-col gap-1">
          {image.caption ? <span className="text-meta font-medium italic text-primary">{image.caption}</span> : null}
          {image.credit ? <span className="text-[0.8125rem] text-caption">{image.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
