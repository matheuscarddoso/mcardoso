import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Scoped to the hosts actually rendered — a wildcard here turns
    // /_next/image into an open resizing proxy for any URL on the internet.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
    ],
  },
};

export default nextConfig;
