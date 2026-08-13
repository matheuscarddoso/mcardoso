/**
 * What is playing on Spotify, or what played last.
 *
 * Both endpoints are user-scoped, so unlike the GitHub calendar there is no
 * anonymous version of this: it needs an OAuth token for one specific account.
 * What production holds is the refresh token, which does not expire, and it
 * trades that for an hour-long access token when it needs one.
 *
 * None of these three values may reach the browser, which is the whole reason
 * this is a route handler rather than a fetch from the card.
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token"
const API = "https://api.spotify.com/v1"

export type NowPlaying = {
  /** True while it is actually playing, false when this is the last track. */
  playing: boolean
  title: string
  artist: string
  /** Opens the track on Spotify. */
  url: string
  cover: string | null
  /** ISO stamp of when it finished. Null while it is still playing. */
  playedAt: string | null
}

type Credentials = { id: string; secret: string; refresh: string }

/**
 * Announced once per instance, then never again. Missing config is not an
 * error worth throwing over: the card falls back to a plain link, which is
 * what it does on a failed fetch too. But it stayed quiet about it, and a card
 * that never opens looks exactly like an account that is not playing anything
 * — which is how production ran unconfigured without anyone noticing.
 */
let warnedMissing = false

function credentials(): Credentials | null {
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN

  if (!id || !secret || !refresh) {
    if (!warnedMissing) {
      warnedMissing = true
      // Names only. The values are the secret; which of them is absent is not.
      const missing = [
        !id && "SPOTIFY_CLIENT_ID",
        !secret && "SPOTIFY_CLIENT_SECRET",
        !refresh && "SPOTIFY_REFRESH_TOKEN",
      ].filter(Boolean)
      console.warn(`[spotify] card disabled, unset: ${missing.join(", ")}`)
    }
    return null
  }

  return { id, secret, refresh }
}

/*
 * Held in module scope for the life of the server instance. Without it every
 * request would spend one round trip minting a token it already had, doubling
 * the latency of a card that opens on hover. A cold instance pays once.
 *
 * Sixty seconds of headroom, so a token can't expire between being read here
 * and arriving at Spotify.
 */
let cachedToken: { value: string; expiresAt: number } | null = null
const EXPIRY_MARGIN_MS = 60_000

async function accessToken({ id, secret, refresh }: Credentials): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      // Basic auth, not a body field: the secret has no business in a payload
      // that might end up in a log.
      authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    cache: "no-store",
  })

  if (!response.ok) {
    // A dead refresh token is the one failure worth naming, because the fix is
    // manual: re-run the authorisation and replace the environment variable.
    throw new Error(`Spotify token: ${response.status}`)
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!data.access_token) throw new Error("Spotify token: no access_token in response")

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 - EXPIRY_MARGIN_MS,
  }
  return cachedToken.value
}

/** The shape both endpoints return a track in, as much of it as we read. */
type Track = {
  name?: string
  artists?: { name?: string }[]
  album?: { images?: { url?: string }[] }
  external_urls?: { spotify?: string }
}

function toNowPlaying(track: Track, playedAt: string | null): NowPlaying | null {
  if (!track.name) return null

  return {
    playing: playedAt === null,
    title: track.name,
    artist: track.artists?.map((a) => a.name).filter(Boolean).join(", ") || "",
    url: track.external_urls?.spotify ?? "https://open.spotify.com",
    // Images come widest first, so the last one is the small square the card
    // actually paints. Falling back to the widest keeps a missing size safe.
    cover: track.album?.images?.at(-1)?.url ?? track.album?.images?.[0]?.url ?? null,
    playedAt,
  }
}

async function spotify(path: string, token: string): Promise<Response> {
  return fetch(`${API}${path}`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })
}

/**
 * Returns `null` when there is nothing to show, which covers a missing
 * configuration, a refused token and an account that has never played
 * anything. The card treats all three the same way, because from the reader's
 * side they are the same thing.
 */
export async function getNowPlaying(): Promise<NowPlaying | null> {
  const creds = credentials()
  if (!creds) return null

  try {
    const token = await accessToken(creds)

    /*
     * `currently-playing` answers 204 with no body when nothing is on, which
     * is most of the time, so the recently-played call is the common path
     * rather than the fallback. 200 with `item: null` happens too, on an ad
     * or a local file.
     */
    const live = await spotify("/me/player/currently-playing", token)
    if (live.status === 200) {
      const data = (await live.json()) as { item?: Track | null; is_playing?: boolean }
      if (data.item && data.is_playing !== false) {
        const track = toNowPlaying(data.item, null)
        if (track) return track
      }
    }

    const recent = await spotify("/me/player/recently-played?limit=1", token)
    if (!recent.ok) throw new Error(`Spotify recently-played: ${recent.status}`)

    const data = (await recent.json()) as {
      items?: { track?: Track; played_at?: string }[]
    }
    const item = data.items?.[0]
    if (!item?.track) return null

    return toNowPlaying(item.track, item.played_at ?? null)
  } catch (error: unknown) {
    console.warn("[spotify] unavailable:", error)
    return null
  }
}
