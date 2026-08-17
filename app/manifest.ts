import type { MetadataRoute } from "next"
import { HOME_SEO, SITE_NAME } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "mcardoso",
    description: HOME_SEO.EN.description,
    lang: "en",
    // `/` and not `/en`: the middleware negotiates the locale, so an installed
    // shortcut opens in the reader's own language rather than the one that
    // happened to be on screen when they saved it.
    start_url: "/",
    // Not "standalone" — this is a site to read, and hiding the URL bar takes
    // away the address and the back button for no gain.
    display: "browser",
    /* Sampled from the corner of the icon, so an installed shortcut has no
       seam between the artwork and the surface behind it. */
    background_color: "#17181b",
    theme_color: "#17181b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
