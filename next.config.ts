import type { NextConfig } from "next";

/**
 * Applied to every response. None of these need a nonce or per-route tuning,
 * which is why they live here rather than in middleware — middleware runs per
 * request and would charge for work these can do statically.
 */
const baseHeaders = [
  // Without this, a file served with a guessed type can be sniffed as HTML.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Cross-origin requests send the origin only, never the full path — article
  // URLs shouldn't ride along in the Referer of every outbound link in the bio.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // A static personal site has no business asking for any of these.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

/**
 * The modern framing control, plus the legacy header for older clients.
 *
 * `DENY` rather than `SAMEORIGIN` everywhere except the CV: nothing else here
 * is meant to be framed at all, and the avatar lightbox is exactly the kind of
 * full-viewport surface clickjacking likes to overlay.
 */
const denyFraming = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
];

/**
 * The one exception. The résumé panel embeds the PDF in an iframe, and `DENY`
 * refuses that even from the page's own origin, which is what left the panel
 * showing a broken-document icon. `'self'` allows this site and nothing else,
 * so an outside page still cannot frame the file.
 *
 * Worth being precise about the risk: the file is already public, so framing
 * it leaks nothing. What these headers protect against is a hostile page
 * overlaying an invisible frame to steal clicks, and a static PDF has no
 * clicks worth stealing.
 */
const allowSelfFraming = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
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
    /*
     * The framing rules are split by path rather than layered, because Next
     * applies every matching entry: a second rule setting `X-Frame-Options`
     * would send the header twice, and a browser given two conflicting values
     * blocks the frame rather than picking one. So the general rule excludes
     * /cv outright instead of being overridden for it.
     */
    return [
      { source: "/((?!cv/).*)", headers: [...baseHeaders, ...denyFraming] },
      { source: "/cv/:path*", headers: [...baseHeaders, ...allowSelfFraming] },
    ];
  },
};

export default nextConfig;
