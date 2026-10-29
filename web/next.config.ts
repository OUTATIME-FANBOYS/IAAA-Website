import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy. Next.js injects small inline scripts for hydration, so script-src needs
 * 'unsafe-inline' (a nonce-based policy would force every page to render dynamically).
 * Everything else is locked down: no plugins, no framing by other sites, forms and base URI only to us,
 * network calls only to this site and the Sanity APIs.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://vercel.live${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://vercel.live wss://*.pusher.com${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-src https://vercel.live",
  "media-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Lets a second server (e.g. a staging preview) run next to the main one: NEXT_DIST_DIR=.next-staging
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Legacy Framer URLs: /member-bios/<group>/<slug> -> /members/<slug>
  async redirects() {
    return [
      { source: "/member-bios", destination: "/members", permanent: true },
      { source: "/member-bios/:group(founding-members|members)/:slug", destination: "/members/:slug", permanent: true },
      { source: "/members/founding-members/:slug", destination: "/members/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
