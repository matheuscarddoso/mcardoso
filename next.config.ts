import type { NextConfig } from "next";

/**
 * Applied to every response. None of these need a nonce or per-route tuning,
 * which is why they live here rather than in middleware — middleware runs per
 * request and would charge for work these can do statically.
 */
const securityHeaders = [
  // Without this, a file served with a guessed type can be sniffed as HTML.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Cross-origin requests send the origin only, never the full path — article
  // URLs shouldn't ride along in the Referer of every outbound link in the bio.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The modern framing control, plus the legacy header for older clients.
  // Nothing here is meant to be framed, and the avatar lightbox is exactly the
  // kind of full-viewport surface clickjacking likes to overlay.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // A static personal site has no business asking for any of these.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Stops announcing the framework, and its major version, on every response.
  poweredByHeader: false,

  images: {
    // Scoped to the hosts actually rendered — a wildcard here turns
    // /_next/image into an open resizing proxy for any URL on the internet.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      // GitHub's own social cards, for the repository links in the writing.
      // Scoped to the one path shape it serves them from.
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        pathname: "/*/**",
      },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
