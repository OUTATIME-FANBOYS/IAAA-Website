import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
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
