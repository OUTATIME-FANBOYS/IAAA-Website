export interface InstagramPost {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
}

interface GraphMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
}

/**
 * Latest posts from @artistsiaaa via the Instagram Graph API.
 * Needs INSTAGRAM_ACCESS_TOKEN (long-lived token for the account); returns [] without it or on any failure.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const url =
      "https://graph.instagram.com/me/media" +
      `?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit * 2}&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: GraphMedia[] };
    // The feed comes from a third party: only accept https links and images.
    const isHttps = (u: string | undefined) => !!u && /^https:\/\//i.test(u);
    return (json.data ?? [])
      .filter((m) => isHttps(m.permalink))
      .map((m) => ({
        id: m.id,
        permalink: m.permalink,
        imageUrl: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? "",
        caption: m.caption ?? "",
      }))
      .filter((p) => isHttps(p.imageUrl))
      .slice(0, limit);
  } catch {
    return [];
  }
}
