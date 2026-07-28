import type { MetadataRoute } from "next"
import { SITE_URL, absolute } from "@/lib/site"

/**
 * Generated rather than served from /public, so the sitemap URL can never
 * drift from the origin the rest of the metadata uses.
 *
 * `/_next/` stays crawlable on purpose: blocking it hides the CSS and JS from
 * Googlebot, which then renders the page unstyled and scores it as broken.
 */
const IS_PRODUCTION = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production"

export default function robots(): MetadataRoute.Robots {
  // Preview and branch deployments serve the same canonicals as production, so
  // anything that crawls them is being told two hosts are the same page.
  // Vercel already sets `X-Robots-Tag: noindex` on previews, but that is the
  // platform's guarantee, not this repo's — it disappears the day the site is
  // hosted somewhere else.
  if (!IS_PRODUCTION) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: SITE_URL,
  }
}
