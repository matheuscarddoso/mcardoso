import { ImageResponse } from "next/og"

/** Facebook, X, LinkedIn and Slack all crop to this ratio. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

/**
 * Shared social card. Rendered at build time for every locale of every route,
 * so it costs nothing at request time and every share has artwork — a
 * `summary_large_image` card with no image renders as a bare link.
 */
export function ogImage({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string
  title: string
  footer: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#111111",
          backgroundImage:
            "radial-gradient(120% 90% at 88% 8%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8a8a8a",
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 48 ? 66 : 82,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            fontWeight: 600,
            // Satori has no `text-wrap: balance`; the width cap does the work.
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#8a8a8a",
          }}
        >
          <span>mcardoso.dev</span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    OG_SIZE
  )
}
