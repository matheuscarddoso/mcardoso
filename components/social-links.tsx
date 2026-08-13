"use client"

import { HoverPreview } from "@/components/link-preview"
import { SOCIAL, type SocialKey } from "@/lib/site"

/**
 * Brand marks as filled paths on a 24-unit grid, except the three that already
 * shipped with their own viewBoxes — those are kept byte-for-byte so the row's
 * optical weight doesn't shift.
 */
type Mark = {
  label: string
  viewBox: string
  /** Optical size, not geometric: the X mark reads heavier at the same box. */
  className: string
  path: string
  fillRule?: "evenodd"
}

const MARKS: Record<SocialKey, Mark> = {
  github: {
    label: "GitHub",
    viewBox: "0 0 1024 1024",
    className: "h-4 w-4",
    fillRule: "evenodd",
    path: "M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0",
  },
  x: {
    // The glyph stays the current X mark; only the name reverts, which is
    // still what most people call the site.
    label: "Twitter",
    viewBox: "0 0 1200 1227",
    className: "h-3 w-3",
    path: "M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z",
  },
  stackoverflow: {
    label: "Stack Overflow",
    viewBox: "0 0 169.61 200",
    className: "h-4 w-4",
    path: "M140.44 178.38v-48.65h21.61V200H0v-70.27h21.61v48.65zM124.24 140.54l4.32-16.22-86.97-17.83-3.78 17.83zM49.7 82.16L130.72 120l7.56-16.22-81.02-37.83zm22.68-40l68.06 57.3 11.35-13.51-68.6-57.3-11.35 13.51zM116.14 0l-14.59 10.81 53.48 71.89 14.58-10.81zM37.81 162.16h86.43v-16.21H37.81z",
  },
  linkedin: {
    label: "LinkedIn",
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  instagram: {
    label: "Instagram",
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z",
  },
  youtube: {
    label: "YouTube",
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  facebook: {
    label: "Facebook",
    viewBox: "0 0 24 24",
    className: "h-4 w-4",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
}

/**
 * What the hover card says about each profile.
 *
 * Written down rather than scraped. The obvious build is to read `og:` tags
 * off each URL, and it does not survive contact: Stack Overflow answers 403 to
 * an unauthenticated request and LinkedIn answers 999, so half the cards would
 * be empty, and a datacentre IP fares worse than a laptop did. Four links that
 * are all the author's own do not need a scraper, an SSRF surface and a
 * runtime dependency on four third parties staying up.
 *
 * GitHub's and X's lines are their own `og:description`, trimmed of the counts
 * that would go stale. The other two are written here, since neither site
 * will hand them over.
 */
type Preview = {
  title: string
  description: string
  /** The bare host, as the card prints it. */
  domain: string
}

const PREVIEWS: Partial<Record<SocialKey, Preview>> = {
  github: {
    title: "matheuscarddoso",
    description: "Software Engineer. Follow their code on GitHub.",
    domain: "github.com",
  },
  x: {
    title: "Matheus Cardoso (@mattcrdoso)",
    description: "Founder at Abacate Pay. Software & Design Engineer at 4Selet.",
    domain: "x.com",
  },
  stackoverflow: {
    title: "Matheus Cardoso",
    description: "Questions and answers on Stack Overflow, where developers learn and share.",
    domain: "stackoverflow.com",
  },
  linkedin: {
    title: "Matheus Cardoso",
    description: "Software Engineer at 4Selet, in Goiânia. Professional profile on LinkedIn.",
    domain: "linkedin.com",
  },
}

/** The mark, drawn at whatever size the caller asks for. */
function Glyph({ mark, className }: { mark: Mark; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={mark.viewBox}
      className={className}
      fill="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule={mark.fillRule}
        clipRule={mark.fillRule}
        d={mark.path}
      />
    </svg>
  )
}

/**
 * The card itself. Its picture is the brand mark on a neutral field rather
 * than a screenshot or an `og:image`: a profile's own share image is a 200px
 * avatar, which stretched across a card looks like a mistake, and two of the
 * four sites publish no image at all. One treatment for all of them also means
 * no remote host to allowlist and nothing to fetch.
 */
function ProfileCard({ mark, preview }: { mark: Mark; preview: Preview }) {
  return (
    <div className="overflow-hidden rounded-xl bg-preview-bg shadow-card-lift">
      <div className="flex h-[104px] items-center justify-center bg-black/[0.04] dark:bg-white/[0.04]">
        <Glyph mark={mark} className="size-10 text-gray-1100" />
      </div>
      <div className="flex flex-col gap-1 p-2.5">
        <p className="truncate text-[13px] font-medium text-gray-1200">{preview.title}</p>
        {/* Three lines then an ellipsis, so a long description cannot stretch
            the card past the height its neighbours settle at. */}
        <p className="line-clamp-3 text-xs leading-[1.45] text-gray-1100">
          {preview.description}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5">
          <Glyph mark={mark} className="size-3 shrink-0 text-gray-1000" />
          <span className="truncate text-xs text-gray-1000">{preview.domain}</span>
        </p>
      </div>
    </div>
  )
}

/**
 * Only the profiles that exist in `SOCIAL` render — adding one there lights up
 * the icon here and adds it to the JSON-LD `sameAs` at the same time.
 *
 * `-m-2 p-2` turns each 16px glyph into a 32px touch target without moving a
 * pixel: the padding grows into the row's 16px gap from both sides, so
 * neighbouring targets meet exactly and never overlap.
 */
export function SocialLinks({ include }: { include: SocialKey[] }) {
  return (
    <>
      {include.map((key) => {
        const href = SOCIAL[key]
        if (!href) return null
        const mark = MARKS[key]
        const preview = PREVIEWS[key]

        const anchor = (
          <a
            key={key}
            id={key}
            href={href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={mark.label}
            className="-m-2 inline-flex p-2 transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] motion-reduce:active:scale-100"
          >
            <Glyph mark={mark} className={mark.className} />
          </a>
        )

        // A profile with nothing written about it is still a working link.
        if (!preview) return anchor

        return (
          <HoverPreview key={key} width={232} trigger={anchor}>
            <ProfileCard mark={mark} preview={preview} />
          </HoverPreview>
        )
      })}
    </>
  )
}
