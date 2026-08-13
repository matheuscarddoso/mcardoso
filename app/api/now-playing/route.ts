import { getNowPlaying } from "@/lib/spotify"

/**
 * A route rather than page data, because "playing now" and the one-hour window
 * the rest of the page is cached on cannot both be true. The card fetches this
 * when it opens, so a reader who never hovers the link never costs a request.
 *
 * Explicitly dynamic. The first version set `revalidate = 30` and Next tried
 * to prerender it at build time, where it collided with the uncacheable token
 * exchange and resolved to an empty 204. A route that reads live state has no
 * business being answered from the build.
 */
export const dynamic = "force-dynamic"

/**
 * Caching moves to the CDN instead, which is where it belongs for a shared
 * answer: thirty seconds collapses a burst of visitors into one call to
 * Spotify, and the stale window means the slow path is never on the reader's
 * critical path.
 */
const CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=60"

export async function GET() {
  const track = await getNowPlaying()

  // Nothing to show is not a failure. 204 says so without making the card
  // parse an error body to find out. Cached for less, so a quiet account
  // starts showing music again promptly.
  if (!track) {
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "public, s-maxage=15, stale-while-revalidate=30" },
    })
  }

  return Response.json(track, { headers: { "cache-control": CACHE_CONTROL } })
}
