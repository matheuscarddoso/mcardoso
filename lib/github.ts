/**
 * GitHub profile + contribution graph, fetched on the server and cached by the
 * Next.js data cache. Both endpoints are public: the REST profile carries the
 * identity, and GitHub's own calendar fragment carries the graph — the
 * contribution calendar is otherwise GraphQL-only, which would need a token.
 *
 * `GITHUB_TOKEN` is honoured when present (it raises the REST rate limit from
 * 60/h per IP), but nothing here requires it.
 */

/** The account the bio links to — its hover card carries the identity. */
const PROFILE_LOGIN = "matheuscarddoso"

/** The account the Contributions section draws. */
const GRAPH_LOGIN = "4st-cardoso"

/** One hour: the graph moves at most once a day, the profile even less. */
const REVALIDATE_SECONDS = 3600

/**
 * Columns shown in the card — a ~5-month window, not the full year. The card's
 * width follows from this, and it has to clear the name + handle line below.
 */
export const CONTRIBUTION_WEEKS = 20

/**
 * Columns in the section graph. GitHub's window is 53 Sunday-aligned columns
 * and has been for years, but the responsive grid hard-codes that count, so a
 * 54th column from a mid-week window would wrap into a second row — the slice
 * drops the leading partial instead.
 */
export const YEAR_WEEKS = 53

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionDay = {
  /** ISO date, `YYYY-MM-DD`. */
  date: string
  level: ContributionLevel
  count: number
}

/** Seven weekday slots, Sunday first. `null` where the window has no day yet. */
export type ContributionWeek = (ContributionDay | null)[]

export type ContributionMonth = {
  /** Column the label sits above. */
  column: number
  /** 0-based month, so the label can be worded per language. */
  month: number
}

export type GithubCardData = {
  login: string
  name: string
  bio: string | null
  avatarUrl: string
  url: string
  weeks: ContributionWeek[]
  months: ContributionMonth[]
  /** Contributions in the last year — the whole year, not just the window. */
  total: number
}

const USER_AGENT = "ocardoso.com (+https://www.ocardoso.com)"

function attribute(tag: string, name: string): string | undefined {
  return new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1]
}

function toLevel(raw: string | undefined): ContributionLevel {
  const level = Number(raw)
  if (!Number.isInteger(level) || level < 0) return 0
  return Math.min(level, 4) as ContributionLevel
}

/**
 * Reads the day cells out of GitHub's calendar markup. Attribute order is not
 * guaranteed, so each `<td>` tag is matched first and then picked apart.
 */
function parseDays(html: string): ContributionDay[] {
  // Counts live in the sibling tooltips ("3 contributions on August 5th."),
  // keyed to each cell by id.
  const counts = new Map<string, number>()
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)</g)) {
    const target = attribute(match[1], "for")
    if (!target) continue
    const leading = /^\s*([\d,.]+)/.exec(match[2])
    counts.set(target, leading ? Number(leading[1].replace(/[.,]/g, "")) : 0)
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const tag = match[1]
    const date = attribute(tag, "data-date")
    if (!date) continue

    const id = attribute(tag, "id")
    days.push({
      date,
      level: toLevel(attribute(tag, "data-level")),
      count: (id && counts.get(id)) || 0,
    })
  }

  return days.sort((a, b) => a.date.localeCompare(b.date))
}

function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

/** Sunday starts a column, so every row is one weekday across the whole grid. */
function groupIntoWeeks(days: ContributionDay[]): ContributionWeek[] {
  const weeks: ContributionWeek[] = []
  let current: ContributionWeek | null = null

  for (const day of days) {
    const index = weekday(day.date)
    if (!current || index === 0) {
      current = Array<ContributionDay | null>(7).fill(null)
      weeks.push(current)
    }
    current[index] = day
  }

  return weeks
}

/** One label per month, at the column where that month first appears. */
function monthLabels(weeks: ContributionWeek[]): ContributionMonth[] {
  const labels: ContributionMonth[] = []
  let previous = -1

  weeks.forEach((week, column) => {
    const first = week.find((day): day is ContributionDay => day !== null)
    if (!first) return

    const [, rawMonth, rawDay] = first.date.split("-").map(Number)
    const month = rawMonth - 1
    if (month === previous) return
    previous = month

    // A leading column that only shows the month's tail would put the label
    // where its cells aren't — GitHub skips it too.
    if (column === 0 && rawDay > 7) return
    labels.push({ column, month })
  })

  return labels
}

function parseTotal(html: string, days: ContributionDay[]): number {
  const match = /([\d,.]+)\s+contributions/.exec(html)
  if (match) return Number(match[1].replace(/[.,]/g, ""))
  return days.reduce((sum, day) => sum + day.count, 0)
}

type Profile = Pick<GithubCardData, "login" | "name" | "bio" | "avatarUrl" | "url">

async function fetchProfile(): Promise<Profile> {
  const response = await fetch(`https://api.github.com/users/${PROFILE_LOGIN}`, {
    headers: {
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": USER_AGENT,
      ...(process.env.GITHUB_TOKEN
        ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) throw new Error(`GitHub profile: ${response.status}`)

  const data = (await response.json()) as {
    login?: string
    name?: string | null
    bio?: string | null
    avatar_url?: string
    html_url?: string
  }

  if (!data.login || !data.avatar_url) throw new Error("GitHub profile: unexpected shape")

  return {
    login: data.login,
    // GitHub stores display names with whatever whitespace was typed in.
    name: data.name?.trim() || data.login,
    bio: data.bio?.trim() || null,
    avatarUrl: data.avatar_url,
    url: data.html_url ?? `https://github.com/${data.login}`,
  }
}

/** The calendar fragment, parsed. Shared by both graphs on the page. */
async function fetchCalendar(login: string): Promise<{ days: ContributionDay[]; total: number }> {
  const response = await fetch(`https://github.com/users/${login}/contributions`, {
    headers: { accept: "text/html", "user-agent": USER_AGENT },
    next: { revalidate: REVALIDATE_SECONDS },
  })

  if (!response.ok) throw new Error(`GitHub contributions: ${response.status}`)

  const html = await response.text()
  const days = parseDays(html)
  if (days.length === 0) throw new Error("GitHub contributions: no day cells")

  return { days, total: parseTotal(html, days) }
}

async function fetchContributions(): Promise<Pick<GithubCardData, "weeks" | "months" | "total">> {
  const { days, total } = await fetchCalendar(PROFILE_LOGIN)
  const weeks = groupIntoWeeks(days).slice(-CONTRIBUTION_WEEKS)

  return { weeks, months: monthLabels(weeks), total }
}

/**
 * Returns `null` when the profile can't be read — the link then renders as a
 * plain anchor rather than an empty card. A missing graph is survivable on its
 * own: the card still has an identity to show.
 */
export async function getGithubCard(): Promise<GithubCardData | null> {
  const [profile, contributions] = await Promise.all([
    fetchProfile().catch((error: unknown) => {
      console.warn("[github] profile unavailable:", error)
      return null
    }),
    fetchContributions().catch((error: unknown) => {
      console.warn("[github] contributions unavailable:", error)
      return null
    }),
  ])

  if (!profile) return null

  return {
    ...profile,
    weeks: contributions?.weeks ?? [],
    months: contributions?.months ?? [],
    total: contributions?.total ?? 0,
  }
}

export type ContributionYear = {
  login: string
  url: string
  weeks: ContributionWeek[]
  /** Contributions in the last year, as GitHub counts them. */
  total: number
}

/**
 * The full year, for the Contributions section. No REST call: the section
 * shows squares, not an identity, so the calendar fragment is the whole
 * dependency — which also keeps it clear of the 60/h unauthenticated API
 * limit the profile fetch has to live inside.
 *
 * Returns `null` when the calendar can't be read, and the section then doesn't
 * render at all — an empty grid would claim a year of no work.
 */
export async function getContributionYear(): Promise<ContributionYear | null> {
  try {
    const { days, total } = await fetchCalendar(GRAPH_LOGIN)

    return {
      login: GRAPH_LOGIN,
      url: `https://github.com/${GRAPH_LOGIN}`,
      // No month axis in the section, so no labels to derive from these.
      weeks: groupIntoWeeks(days).slice(-YEAR_WEEKS),
      total,
    }
  } catch (error: unknown) {
    console.warn("[github] contribution year unavailable:", error)
    return null
  }
}
