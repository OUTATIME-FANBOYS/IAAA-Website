import Image from "next/image";
import { cn } from "./cn";

export interface AvatarProps {
  /** Square image URL. Without one an empty circle is shown. */
  src?: string;
  /** Diameter in px (the image is expected to be at least twice this for sharp screens). */
  size?: number;
  className?: string;
}

/** Small round portrait. Decorative: the person's name always sits next to it, so it has no alt text. */
export function Avatar({ src, size = 56, className }: AvatarProps) {
  const box = cn("shrink-0 overflow-hidden rounded-full bg-subtle", className);
  return src ? (
    <Image src={src} alt="" width={size * 2} height={size * 2} unoptimized className={cn(box, "object-cover")} style={{ width: size, height: size }} />
  ) : (
    <span aria-hidden="true" className={box} style={{ width: size, height: size }} />
  );
}
