import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({
  projectId: projectId || "missing-project-id",
  dataset,
});

/** Raw builder: urlFor(img).width(800).height(600).url() */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

type ImageLike = { asset?: unknown; alt?: string | null } | null | undefined;

/**
 * Resolve a CMS image to { src, alt }, or null if there is no asset.
 * Alt text always travels with the URL.
 */
export function imageProps(
  image: ImageLike,
  opts: { width?: number; height?: number; fallbackAlt?: string } = {},
): { src: string; alt: string } | null {
  if (!image || !image.asset) return null;
  try {
    let b = urlFor(image as SanityImageSource).auto("format");
    if (opts.width) b = b.width(opts.width);
    if (opts.height) b = b.height(opts.height).fit("crop");
    return { src: b.url(), alt: image.alt ?? opts.fallbackAlt ?? "" };
  } catch {
    return null;
  }
}
