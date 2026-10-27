import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
