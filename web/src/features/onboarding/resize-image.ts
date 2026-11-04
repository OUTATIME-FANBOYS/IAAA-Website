const MAX_SIDE = 2000;

/**
 * Shrinks a photo in the browser before upload: longest side 2000px, JPEG. Phone photos are often 5-10 MB,
 * more than the server accepts, and this also drops location data embedded in the original.
 * Returns null if the browser cannot read the file as an image.
 */
export async function resizeImage(file: File): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) return null;
    return new File([blob], "profile.jpg", { type: "image/jpeg" });
  } catch {
    return null;
  }
}
