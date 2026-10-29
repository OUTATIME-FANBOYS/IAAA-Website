import Image from "next/image";
import type { ReactNode } from "react";
import { LightboxTrigger } from "./Lightbox";

export interface ArtworkTileProps {
  image?: { src: string; alt: string } | null;
  title?: string;
  /** Second line, e.g. medium and size, or the artist. */
  subtitle?: ReactNode;
  /** Position in the surrounding LightboxGroup; omit to make the tile non-interactive. */
  lightboxIndex?: number;
}

/** Square image tile with a fixed-height caption (title trimmed to 2 lines, subtitle to 1). */
export function ArtworkTile({ image, title, subtitle, lightboxIndex }: ArtworkTileProps) {
  const body = (
    <>
      <span className="relative block aspect-square w-full overflow-hidden rounded-ds border border-subtle bg-paper">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1200px) 25vw, (min-width: 810px) 33vw, 50vw"
            className="object-cover"
          />
        ) : null}
      </span>
      <span className="mt-3 block h-[4.25rem] overflow-hidden">
        {title ? <span className="line-clamp-2 font-serif text-meta font-medium text-primary">{title}</span> : null}
        {subtitle ? <span className="mt-0.5 line-clamp-1 block text-[0.8125rem] text-caption">{subtitle}</span> : null}
      </span>
    </>
  );
  if (lightboxIndex === undefined || !image) return <div>{body}</div>;
  return (
    <LightboxTrigger index={lightboxIndex} label={title ?? image.alt}>
      {body}
    </LightboxTrigger>
  );
}
