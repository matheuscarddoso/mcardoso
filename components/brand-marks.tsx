/**
 * The logos that sit inside the bio's sentences, beside the name they belong
 * to.
 *
 * Three things make a mark work inline rather than beside a heading:
 *
 * - Brand colour where the brand has one, `currentColor` where it doesn't.
 *   The two exceptions are GitHub and X, whose marks *are* black on light and
 *   white on dark: painting either one its literal brand value would make it
 *   disappear into one of the two themes. Those stay on the text colour, which
 *   is the same thing their own brand guidance asks for.
 * - `em`, never `px`. The mark tracks whatever the surrounding text does,
 *   including a reader's own font scaling.
 * - One square box for all of them, with each viewBox letterboxed into it by
 *   `preserveAspectRatio`'s default. A wide mark like Zero7 then centres in
 *   the same slot a square one occupies, so a sentence carrying several keeps
 *   an even rhythm instead of stepping up and down.
 *
 * `inline-block` is doing quiet work too: an atomic inline box is not painted
 * by an ancestor's `text-decoration`, so the link's underline skips the logo
 * and resumes under the word — which is what you'd draw by hand.
 */

type MarkName =
  | "4selet"
  | "zero7"
  | "goias"
  | "spotify"
  | "kubo"
  | "twitter"
  | "github"

/**
 * Where a mark's own centre should land, in em above the text baseline.
 *
 * This is the whole alignment story, and it replaces `vertical-align: middle`.
 * `middle` sounds like what we want but it anchors the centre to half the
 * font's x-height, roughly 0.26em, which sits low under text carrying capitals
 * — and it moves with whatever font is loaded. Pinning an explicit centre near
 * half the cap height instead means every mark is aligned to the same line by
 * construction, whatever its own height, and one number here nudges all of
 * them together.
 *
 * Exported because the avatar stack has to sit on this same line.
 */
export const MARK_CENTER = 0.34

/** Gap between a mark and the word it belongs to. */
const MARK_GAP = 0.3

/** Default rendered height, in em. */
const DEFAULT_HEIGHT = 0.95

type Mark = {
  viewBox: string
  /** One `<path d>` per subpath the artwork needs. */
  paths: readonly string[]
  /**
   * Rendered height in em, when the artwork argues against the default:
   *
   * - KuboFood is solid mass where the others are rings and cut shapes. Equal
   *   boxes do not mean equal weight, so it is set smaller on purpose.
   * - The X mark reads heavier than its neighbours, which is why the header
   *   row already draws it at 12px against 16px for everything beside it.
   */
  height?: number
  /** Rendered width in em. Square unless the artwork is a wordmark. */
  width?: number
  /** Solid brand colour. Omitted means the mark takes the text's colour. */
  fill?: string
  /**
   * Two-stop linear gradient, sampled off the brand's own artwork. The
   * coordinates are fractions of the *path's* bounding box, which is what SVG
   * gradients default to, so they stay correct whatever the viewBox does.
   */
  gradient?: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }
  /** Only Spotify's artwork is drawn with holes in it. */
  evenOdd?: boolean
}

const MARKS: Record<MarkName, Mark> = {
  "4selet": {
    /*
     * Padded, where the avocado had to be cropped. The artwork fills its own
     * 385x385 box corner to corner, and the "4" is cut out of it in negative
     * space, so at 14px the light strokes ran straight off all four edges and
     * the rounded silhouette dissolved. The mark stopped reading as an object
     * and started reading as a crop of a larger pattern, which is worse next
     * to the closed shapes it shares the sentence with.
     *
     * 32 units of air a side gives the squircle a boundary again. The box goes
     * back to the default height because the padding is what shrinks the ink:
     * the visible mark lands at 0.81em against the 0.95em it started at.
     */
    viewBox: "-32 -32 449 449",
    gradient: { from: "#2a66af", to: "#1d2a57", x1: 0.15, y1: 0.1, x2: 0.9, y2: 0.95 },
    paths: [
      "M278.345 302.408V385H85.8447C39.6182 385 1.92522 348.462 0.0712891 302.69L0.363281 302.408H278.345ZM384.939 302.408C383.6 338.369 360.141 368.673 327.771 380.114V302.408H384.939ZM327.771 4.88477C361.112 16.6695 385 48.4675 385 85.8447V262.737H327.771V4.88477ZM278.345 42.1826V262.737H50.9336V253.296L268.317 42.1826H278.345ZM0 243.96V85.8447C0 38.4341 38.4341 0 85.8447 0H251.206L0 243.96Z",
    ],
  },
  zero7: {
    viewBox: "0 0 923 512",
    // 1.8:1, so it gets a 1.8:1 box rather than being letterboxed into a
    // square, where it would only get 0.53em of height. 1.3 / 0.72 = 1.806,
    // which is the artwork's own ratio, so it fills the box it is given.
    height: 0.72,
    width: 1.3,
    gradient: { from: "#0062a8", to: "#003e83", x1: 0.05, y1: 0.5, x2: 0.95, y2: 0.4 },
    paths: [
      "M226.6 2.19999C167.6 8.79999 108.8 38.4 68.8 81.2C23.6 129.6 0 189.4 0 256C0 322.6 23.6 382.4 68.8 430.8C105.6 470 160.4 499.2 215.4 508.4C238.8 512.4 286.2 511.4 310 506.2C372.2 493.2 428.6 458.6 465.4 411.2C472.2 402.4 495.8 365.8 517.6 330C539.4 294.2 558.6 263 560.2 260.4L563 256L495.6 256.4L428 257L405.8 294C375.8 344 367.8 354.8 352 368.2C306.8 406.2 241.4 413.4 189 386C152.2 366.8 127 336.6 114.2 296C107.6 274.4 107.6 237.6 114.2 216C130.2 165 169.2 127.2 220 113.8C235.4 109.6 238 109.6 504.6 110C652.6 110.2 773.8 110.6 774 110.8C774.4 111 721 201 655.6 310.6C590.2 420.4 536.6 510.6 536.6 511C536.6 511.6 566.6 512 603.2 512H669.6L796.2 300.4L922.6 88.8V44.4V-7.62939e-06L582.2 0.199992C394.8 0.399992 234.8 1.19999 226.6 2.19999Z",
    ],
  },
  goias: {
    viewBox: "0 0 1919 1919",
    fill: "#009b3a",
    paths: [
      "M901.405 1.72393C662.605 16.1239 436.005 120.324 269.605 292.724C20.8053 550.324 -63.7947 923.524 49.4053 1263.52C117.605 1468.72 252.005 1643.12 433.605 1762.12C658.805 1909.72 932.405 1955.32 1196.21 1889.32C1261.01 1873.12 1318.41 1851.92 1382.41 1820.52C1519.01 1753.52 1634.61 1658.12 1725.81 1537.52C1969.21 1215.32 1983.81 772.924 1762.01 433.524C1725.81 378.124 1687.61 331.524 1637.41 281.524C1598.01 241.924 1576.01 222.724 1534.41 191.524C1352.61 55.3239 1128.41 -11.8761 901.405 1.72393ZM1040.41 185.524C1074.01 189.124 1119.61 197.324 1151.81 205.524C1333.01 251.724 1485.21 356.724 1596.21 512.324C1655.21 594.924 1701.81 704.324 1722.21 807.524C1751.81 957.124 1736.21 1116.92 1678.41 1256.32C1615.01 1409.52 1503.01 1540.52 1363.01 1625.32C1096.41 1786.72 752.805 1772.72 501.805 1590.12C458.805 1558.72 403.605 1508.32 369.805 1468.92C262.805 1344.72 198.205 1191.32 183.405 1025.52C178.805 972.724 181.805 889.924 190.405 836.524C211.805 703.524 267.805 576.924 352.005 471.924C376.405 441.324 425.805 390.524 455.805 365.124C580.405 259.524 732.005 197.324 899.405 183.524C925.605 181.324 1013.61 182.524 1040.41 185.524Z",
      "M911.405 322.924C863.405 327.524 815.005 336.324 776.205 347.724C563.405 409.724 397.605 581.724 341.405 798.124C326.805 854.124 321.205 899.124 321.205 959.524C321.205 1008.12 324.405 1042.92 333.405 1087.52C375.805 1299.72 522.205 1473.32 726.405 1554.12C797.405 1582.12 862.205 1595.12 941.805 1596.92C1007.61 1598.52 1052.01 1593.92 1110.41 1579.52C1314.01 1529.32 1476.81 1387.32 1553.01 1193.32C1588.21 1103.72 1603.61 1003.72 1594.21 924.924L1593.01 915.524H961.405V1095.52H1393.81L1392.41 1101.92C1387.61 1123.72 1363.21 1174.72 1341.81 1207.52C1271.41 1315.52 1165.21 1385.72 1035.41 1409.92C1007.61 1414.92 940.205 1416.92 909.205 1413.52C721.205 1392.92 564.605 1257.32 517.405 1074.72C489.605 967.724 500.805 857.524 549.405 758.524C630.405 593.724 802.205 492.524 982.605 503.524C1130.61 512.724 1252.41 581.724 1336.81 704.524C1346.01 718.124 1352.61 725.524 1357.21 727.924C1363.41 731.124 1372.41 731.324 1456.81 730.724C1508.01 730.324 1550.21 729.324 1550.81 728.724C1552.61 726.924 1538.41 691.924 1525.21 665.524C1479.01 573.324 1405.01 490.524 1314.41 429.524C1224.41 368.924 1125.01 333.724 1016.41 323.524C996.405 321.724 928.205 321.324 911.405 322.924Z",
    ],
  },
  spotify: {
    viewBox: "0 0 24 24",
    fill: "#1db954",
    evenOdd: true,
    paths: [
      "M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z",
    ],
  },
  /* Already one colour, so it reduces on its own. */
  kubo: {
    viewBox: "0 0 567 566",
    fill: "#fb4310",
    // Fills its box corner to corner as solid mass, where the others are rings
    // and cut shapes. Set down so it weighs the same, not so it measures the same.
    height: 0.78,
    paths: [
      "M425.733 565.064H567V423.799H425.733V565.064Z",
      "M0 565.064H284.468V423.799H141.267V141.267H425.733V282.532H284.468V423.799H425.733V284.468H567V0H0V565.064Z",
    ],
  },
  twitter: {
    viewBox: "0 0 1200 1227",
    // The same reduction the header row already makes for this mark, which is
    // set at 12px there against 16px for everything beside it.
    height: 0.75,
    paths: [
      "M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z",
    ],
  },
  github: {
    viewBox: "0 0 1024 1024",
    evenOdd: true,
    paths: [
      "M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0",
    ],
  },
}

/**
 * `aria-hidden`: every one of these sits inside a link that already says the
 * name in words, so announcing the logo too would read the company twice.
 */
export function BrandMark({ name }: { name: MarkName }) {
  const mark = MARKS[name]
  const height = mark.height ?? DEFAULT_HEIGHT

  /*
   * Derived from the name rather than randomised, so the markup is identical
   * on the server and in the browser. Each mark appears once per page; were
   * one to repeat, both copies would point at the same gradient, which paints
   * the same thing anyway.
   */
  const gradientId = `brand-gradient-${name}`
  const paint = mark.gradient ? `url(#${gradientId})` : (mark.fill ?? "currentColor")

  return (
    <svg
      viewBox={mark.viewBox}
      aria-hidden
      focusable="false"
      /*
       * Sized and shifted inline rather than through utility classes. Two
       * reasons: `vertical-align` has to be computed from this mark's own
       * height, which no fixed class can do, and every arbitrary Tailwind
       * class here would have to exist as a literal string somewhere for the
       * scanner to emit it.
       *
       * `vertical-align` positions the box's *bottom* edge against the
       * baseline, so putting the centre at MARK_CENTER means dropping the
       * bottom half a height below it. That subtraction is the whole reason
       * marks of five different heights land on one line.
       */
      style={{
        width: `${mark.width ?? height}em`,
        height: `${height}em`,
        verticalAlign: `${(MARK_CENTER - height / 2).toFixed(3)}em`,
        marginRight: `${MARK_GAP}em`,
      }}
      className="inline-block"
    >
      {mark.gradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1={mark.gradient.x1}
            y1={mark.gradient.y1}
            x2={mark.gradient.x2}
            y2={mark.gradient.y2}
          >
            <stop offset="0" stopColor={mark.gradient.from} />
            <stop offset="1" stopColor={mark.gradient.to} />
          </linearGradient>
        </defs>
      )}
      {mark.paths.map((d) => (
        <path
          key={d}
          d={d}
          fill={paint}
          fillRule={mark.evenOdd ? "evenodd" : undefined}
          clipRule={mark.evenOdd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  )
}
