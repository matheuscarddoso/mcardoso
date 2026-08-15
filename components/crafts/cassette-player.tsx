"use client"

import * as React from "react"
import * as Slider from "@radix-ui/react-slider"
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * An audio player built into a compact cassette.
 *
 * The reels turn with the tape, the spools trade diameter as it winds across,
 * and rewinding runs the whole thing backwards rather than jumping to zero.
 * All of that is driven by three CSS variables set from a rAF loop, so the
 * animation never passes through React.
 */

const DEFAULT_AUDIO = "/crafts/cassette/one-small-step.mp3"
const DEFAULT_TITLE = "One Small Step"
const DEFAULT_VOLUME = 0.78

/** Six teeth on the hub, evenly spaced. */
const REEL_SPOKES = [0, 60, 120, 180, 240, 300] as const
/** The ribs across the tape window. */
const WINDOW_RIBS = [0, 1, 2, 3, 4] as const

/** Rewind takes longer the further back it has to go, within these bounds. */
const MIN_REWIND_MS = 220
const MAX_REWIND_MS = 1000

/**
 * Grain over the plastic. Inline SVG turbulence rather than an image: it is a
 * few hundred bytes, it never blurs, and it costs no request.
 */
const TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const BUTTON =
  "grid aspect-square cursor-pointer place-items-center rounded-full border text-[#fdfdfc] transition-[background-color,opacity,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 motion-reduce:duration-[0.01ms]"

export type CassetteCaptionTrack = {
  default?: boolean
  label: string
  src: string
  srcLang: string
}

export type CassettePlayerProps = Omit<React.ComponentPropsWithRef<"section">, "children"> & {
  /** Small caps line above the title. */
  archiveLabel?: string
  audioSrc?: string
  captionTracks?: readonly CassetteCaptionTrack[]
  /** Printed small on the label, under the side badge. */
  catalogueNumber?: string
  initialVolume?: number
  loop?: boolean
  onPlaybackChange?: (isPlaying: boolean) => void
  onPlaybackError?: (error: unknown) => void
  preload?: "auto" | "metadata" | "none"
  sideLabel?: string
  trackTitle?: string
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${rest.toString().padStart(2, "0")}`
}

/** The `datetime` form, which wants a duration and not a clock reading. */
function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "PT0S"
  return `PT${Math.floor(seconds)}S`
}

function clampVolume(volume: number) {
  return Number.isFinite(volume) ? Math.min(Math.max(volume, 0), 1) : DEFAULT_VOLUME
}

function Reel({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 z-3 aspect-square w-[78cqh] -translate-x-1/2 -translate-y-1/2",
        className
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 origin-center rotate-[var(--reel-rotation)] rounded-full will-change-transform motion-reduce:rotate-0!"
      >
        <circle cx="50" cy="50" r="48" className="fill-[#fdfdfc]" />
        {REEL_SPOKES.map((angle) => (
          <path
            key={angle}
            d="M46 3h8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"
            transform={`rotate(${angle} 50 50)`}
            className="fill-[var(--reel-teeth)] stroke-[var(--reel-tooth-stroke)] [stroke-linejoin:round] [stroke-width:1.25] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.32))]"
          />
        ))}
        <circle
          cx="50"
          cy="50"
          r="48"
          className="fill-none stroke-[var(--reel-window)] [stroke-width:3]"
        />
      </svg>
    </div>
  )
}

function Screw({ className }: { className: string }) {
  const slot =
    "absolute top-1/2 right-[18%] left-[18%] h-[14%] -translate-y-1/2 rounded-full bg-[#1d1d1b] shadow-[inset_0_1px_1px_rgba(0,0,0,0.82),0_1px_rgba(255,255,255,0.1)]"

  return (
    <div
      aria-hidden
      className={cn(
        "absolute z-3 aspect-square w-[3.3%] rounded-full border border-[#060606] bg-[radial-gradient(circle_at_36%_30%,#5f5f5c,#30302e_48%,#171716_78%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.26),0_1px_1px_rgba(0,0,0,0.38)]",
        className
      )}
    >
      <span className={cn(slot, "rotate-45")} />
      <span className={cn(slot, "-rotate-45")} />
    </div>
  )
}

export function CassettePlayer({
  archiveLabel = "Archive 11",
  audioSrc = DEFAULT_AUDIO,
  captionTracks = [],
  catalogueNumber = "200769",
  className,
  initialVolume = DEFAULT_VOLUME,
  loop = true,
  onPlaybackChange,
  onPlaybackError,
  preload = "metadata",
  ref,
  sideLabel = "Side A",
  trackTitle = DEFAULT_TITLE,
  ...sectionProps
}: CassettePlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const cassetteRef = React.useRef<HTMLDivElement>(null)
  const durationRef = React.useRef(0)
  const playingRef = React.useRef(false)
  const sourceRef = React.useRef(audioSrc)
  const rewindRef = React.useRef<number | null>(null)
  const resumeAfterRewind = React.useRef(false)
  const resumeAfterScrub = React.useRef(false)

  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [volume, setVolume] = React.useState(() => clampVolume(initialVolume))
  const [lastVolume, setLastVolume] = React.useState(() => clampVolume(initialVolume))

  /**
   * Everything that moves, written straight to the DOM.
   *
   * These run at sixty frames a second. Through state they would re-render the
   * whole cassette that often, and the reels do not need React's opinion on
   * what angle they are at.
   */
  const paint = React.useCallback((time: number) => {
    const cassette = cassetteRef.current
    if (!cassette) return

    const total = durationRef.current
    const progress = total > 0 ? Math.min(Math.max(time / total, 0), 1) : 0

    cassette.style.setProperty("--reel-rotation", `${(time * 300) % 360}deg`)
    /* The spools trade diameter: the left one empties as the right fills. */
    cassette.style.setProperty("--left-tape-scale", `${1 - progress * 0.4}`)
    cassette.style.setProperty("--right-tape-scale", `${0.6 + progress * 0.4}`)
  }, [])

  const fail = React.useCallback(
    (cause: unknown, message: string) => {
      setError(message)
      onPlaybackError?.(cause)
    },
    [onPlaybackError]
  )

  const setPlaying = React.useCallback(
    (next: boolean) => {
      if (playingRef.current === next) return
      playingRef.current = next
      setIsPlaying(next)
      onPlaybackChange?.(next)
    },
    [onPlaybackChange]
  )

  const readDuration = React.useCallback(
    (audio: HTMLAudioElement) => {
      const next = Number.isFinite(audio.duration) ? audio.duration : 0
      durationRef.current = next
      setDuration(next)
      paint(audio.currentTime)
    },
    [paint]
  )

  React.useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  /* Metadata may already have arrived before this mounted. */
  React.useEffect(() => {
    const audio = audioRef.current
    if (audio && audio.readyState >= 1) readDuration(audio)
  }, [readDuration])

  /* A new source resets everything, including a rewind mid-flight. */
  React.useEffect(() => {
    if (sourceRef.current === audioSrc) return
    sourceRef.current = audioSrc

    if (rewindRef.current !== null) {
      cancelAnimationFrame(rewindRef.current)
      rewindRef.current = null
    }

    const audio = audioRef.current
    audio?.pause()
    audio?.load()
    durationRef.current = 0
    resumeAfterRewind.current = false
    resumeAfterScrub.current = false
    setCurrentTime(0)
    setDuration(0)
    setPlaying(false)
    setError(null)
    paint(0)
  }, [audioSrc, setPlaying, paint])

  /* `timeupdate` fires about four times a second, which is fine for the clock
     and far too coarse for the reels. */
  React.useEffect(() => {
    if (!isPlaying) return
    let frame = 0

    const step = () => {
      const audio = audioRef.current
      if (!audio || audio.paused) return
      paint(audio.currentTime)
      setCurrentTime(audio.currentTime)
      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, paint])

  React.useEffect(
    () => () => {
      if (rewindRef.current !== null) cancelAnimationFrame(rewindRef.current)
    },
    []
  )

  function cancelRewind() {
    if (rewindRef.current === null) return
    cancelAnimationFrame(rewindRef.current)
    rewindRef.current = null
    resumeAfterRewind.current = false

    const audio = audioRef.current
    if (audio) {
      audio.currentTime = currentTime
      paint(currentTime)
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio) return

    cancelRewind()

    if (!audio.paused) {
      audio.pause()
      return
    }

    try {
      await audio.play()
    } catch (cause) {
      setPlaying(false)
      fail(cause, "Playback could not start. Check the audio source and try again.")
    }
  }

  /**
   * Winds back rather than jumping. A cassette cannot seek, and the whole point
   * of putting a player in one is that it behaves like the object.
   */
  function restart() {
    const audio = audioRef.current
    if (!audio) return

    if (rewindRef.current !== null) cancelAnimationFrame(rewindRef.current)

    resumeAfterRewind.current = resumeAfterRewind.current || !audio.paused
    if (!audio.paused) audio.pause()

    const from = currentTime
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const finish = () => {
      rewindRef.current = null
      audio.currentTime = 0
      setCurrentTime(0)
      paint(0)

      const resume = resumeAfterRewind.current
      resumeAfterRewind.current = false
      if (!resume) return

      audio.play().catch((cause) => {
        setPlaying(false)
        fail(cause, "Playback could not resume after restarting the track.")
      })
    }

    if (from <= 0 || reduced) {
      finish()
      return
    }

    const share = duration > 0 ? Math.min(Math.max(from / duration, 0), 1) : 1
    const span = MIN_REWIND_MS + (MAX_REWIND_MS - MIN_REWIND_MS) * share
    const startedAt = performance.now()

    const wind = (now: number) => {
      const linear = Math.min((now - startedAt) / span, 1)
      const next = from * (1 - easeInOutCubic(linear))

      paint(next)
      setCurrentTime(next)

      if (linear < 1) {
        rewindRef.current = requestAnimationFrame(wind)
        return
      }
      finish()
    }

    rewindRef.current = requestAnimationFrame(wind)
  }

  function seek(next: number) {
    const audio = audioRef.current
    if (!audio) return

    cancelRewind()
    const clamped = Math.min(Math.max(next, 0), durationRef.current)
    audio.currentTime = clamped
    setCurrentTime(clamped)
    paint(clamped)
  }

  /* Paused while the thumb is down, so scrubbing does not stutter the audio. */
  function startScrubbing() {
    const audio = audioRef.current
    if (!audio) return

    cancelRewind()
    resumeAfterScrub.current = !audio.paused
    if (!audio.paused) audio.pause()
  }

  async function endScrubbing() {
    const audio = audioRef.current
    const resume = resumeAfterScrub.current
    resumeAfterScrub.current = false
    if (!audio || !resume) return

    try {
      await audio.play()
    } catch (cause) {
      setPlaying(false)
      fail(cause, "Playback could not resume after seeking the track.")
    }
  }

  function changeVolume(next: number) {
    const audio = audioRef.current
    if (!audio) return

    const clamped = clampVolume(next)
    audio.volume = clamped
    setVolume(clamped)
    /* Remembered so unmuting returns to where it was, not to a default. */
    if (clamped > 0) setLastVolume(clamped)
  }

  const muted = volume === 0

  return (
    <section
      aria-label={`${trackTitle} audio player`}
      {...sectionProps}
      ref={ref}
      className={cn(
        "grid w-full place-items-center overflow-hidden rounded-xl bg-preview-bg px-8 py-16 [container-type:inline-size] max-[560px]:px-3.5 max-[560px]:py-10",
        /* Reel colours, so the cassette reads as moulded plastic in both
           themes rather than as the same photograph twice. */
        "[--reel-teeth-stroke:#11100f] [--reel-teeth:#1b1a18]",
        "dark:[--reel-teeth-stroke:var(--color-gray-500)] dark:[--reel-teeth:var(--color-gray-300)]",
        /* The paper label: cream in the light theme, red in the dark one, the
           way a second pressing of the same tape would be. */
        "[--label-bg:#fdfdfc] [--label-ink:var(--color-gray-1200)]",
        "[--label-border:color-mix(in_srgb,#fdfdfc_50%,transparent)]",
        "[--label-kicker:color-mix(in_srgb,var(--color-gray-1200)_85%,transparent)]",
        "[--label-catalogue:color-mix(in_srgb,var(--color-gray-1200)_70%,transparent)]",
        "[--stripe-one:#16a34a] [--stripe-two:#0d9488] [--stripe-three:#2563eb]",
        "[--thumb-ring:#fdfdfc]",
        "dark:[--label-bg:#dc2626] dark:[--label-ink:#fff]",
        "dark:[--label-border:color-mix(in_srgb,#000_15%,transparent)]",
        "dark:[--label-kicker:color-mix(in_srgb,#fff_85%,transparent)]",
        "dark:[--label-catalogue:color-mix(in_srgb,#fff_70%,transparent)]",
        "dark:[--stripe-one:#fff] dark:[--stripe-two:#fff] dark:[--stripe-three:#fff]",
        "dark:[--thumb-ring:#7f1d1d]",
        className
      )}
    >
      {/* Captions come in through `captionTracks`; there is no track to
          hard-code, because the component does not own the audio. */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop={loop}
        preload={preload}
        onDurationChange={(event) => readDuration(event.currentTarget)}
        onEnded={() => setPlaying(false)}
        onError={(event) =>
          fail(event.currentTarget.error, "This audio track could not be loaded.")
        }
        onLoadedMetadata={(event) => {
          readDuration(event.currentTarget)
          setError(null)
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => {
          setPlaying(true)
          setError(null)
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime)
          paint(event.currentTarget.currentTime)
        }}
      >
        {captionTracks.map((track) => (
          <track
            key={`${track.srcLang}-${track.src}`}
            default={track.default}
            kind="captions"
            label={track.label}
            src={track.src}
            srcLang={track.srcLang}
          />
        ))}
      </audio>

      <div className="w-full max-w-[530px]">
        {/*
          `dark` on the shell, not on the page: the cassette body is dark
          plastic in both themes, and this lets the parts inside it keep using
          the same dark: variants they would anywhere else.
        */}
        <div
          ref={cassetteRef}
          className="dark relative aspect-[1.58] w-full overflow-hidden rounded-[18px] border border-[#050505] bg-[linear-gradient(165deg,#373735_0%,#20201f_52%,#0e0e0d_100%)] shadow-[0_28px_48px_rgba(0,0,0,0.24),0_8px_16px_rgba(0,0,0,0.18),inset_0_2px_1px_rgba(255,255,255,0.2),inset_0_-3px_3px_rgba(0,0,0,0.74)] [--left-tape-scale:1] [--reel-rotation:0deg] [--right-tape-scale:0.6] max-[560px]:rounded-xl"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-1.5 rounded-[13px] border border-white/[0.12] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.62)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ backgroundImage: TEXTURE }}
          />

          <Screw className="top-[4%] left-[2.53%]" />
          <Screw className="top-[4%] right-[2.53%]" />
          <Screw className="bottom-[4%] left-[2.53%]" />
          <Screw className="right-[2.53%] bottom-[4%]" />

          <div className="absolute top-[9.5%] right-[8.5%] bottom-[24%] left-[8.5%] z-1 overflow-clip rounded-[9px] border-4 border-transparent bg-[var(--label-bg)] text-[var(--label-ink)] shadow-[inset_0_0_12px_rgba(92,74,49,0.12)] [container-type:inline-size] [overflow-clip-margin:border-box] max-[560px]:rounded-md">
            <div className="relative z-2 mx-4 mt-4 flex items-stretch justify-between">
              <div className="grid min-w-0 content-between gap-y-2">
                <span className="relative z-2 font-mono text-[clamp(8px,2.5cqw,11px)] leading-none font-bold tracking-[0.12em] text-[var(--label-kicker)] uppercase">
                  {archiveLabel}
                </span>
                <span className="relative z-2 block truncate font-sans text-[clamp(12px,4.6cqw,20px)] leading-none font-semibold tracking-[-0.04em]">
                  {trackTitle}
                </span>
              </div>

              <div className="ml-2 grid shrink-0 content-between justify-items-end gap-y-2 font-mono leading-none font-bold uppercase">
                <span className="rounded-full border border-[var(--label-ink)] bg-[var(--label-ink)] px-[7px] py-1 text-[clamp(8px,2.5cqw,11px)] tracking-[0.08em] text-[var(--label-bg)]">
                  {sideLabel}
                </span>
                <span className="font-mono text-[clamp(7px,2.2cqw,10px)] tracking-[0.08em] text-[var(--label-catalogue)]">
                  {catalogueNumber}
                </span>
              </div>
            </div>

            <div className="relative mt-4 h-[34%] max-[560px]:h-[31%]">
              <div
                aria-hidden
                className="absolute top-1/2 -inset-x-1 grid h-[58%] -translate-y-1/2 grid-rows-3 gap-y-1"
              >
                <span className="bg-[var(--stripe-one)]" />
                <span className="bg-[var(--stripe-two)]" />
                <span className="bg-[var(--stripe-three)]" />
              </div>

              <div className="absolute inset-x-[17.5%] inset-y-0 z-3 overflow-hidden rounded-full bg-[#1b1a18] bg-[linear-gradient(rgba(255,255,255,0.13),transparent_45%)] shadow-[0_0_0_4px_var(--label-border),inset_0_3px_8px_rgba(0,0,0,0.58)] [--reel-window:#1b1a18] [container-type:size]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
                  style={{ backgroundImage: TEXTURE }}
                />
                <div
                  aria-hidden
                  className="absolute top-[12%] right-[28%] bottom-[12%] left-[28%] z-2 flex items-center justify-evenly overflow-hidden rounded-[3px] border-2 border-[#11100f] bg-[#393631] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),transparent_42%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.72),0_0_0_2px_rgba(255,255,255,0.08)]"
                >
                  {/* The wound tape itself. `cqh`/`cqw` keep the two spools on
                      the reel centres at any width the cassette is drawn at. */}
                  <span className="absolute top-1/2 left-[calc(50cqh-28cqw)] aspect-square h-[360%] -translate-x-1/2 -translate-y-1/2 scale-[var(--left-tape-scale)] rounded-full border border-[#0d0a08] bg-[repeating-radial-gradient(circle,#050505_0_2px,#171717_2px_4px)] shadow-[inset_0_0_5px_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.5)] will-change-transform" />
                  <span className="absolute top-1/2 left-[calc(72cqw-50cqh)] aspect-square h-[360%] -translate-x-1/2 -translate-y-1/2 scale-[var(--right-tape-scale)] rounded-full border border-[#0d0a08] bg-[repeating-radial-gradient(circle,#050505_0_2px,#171717_2px_4px)] shadow-[inset_0_0_5px_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.5)] will-change-transform" />
                  {WINDOW_RIBS.map((rib) => (
                    <span
                      key={rib}
                      className="relative z-1 h-[42%] w-0.5 bg-[rgba(224,215,195,0.28)]"
                    />
                  ))}
                </div>
                <Reel className="left-[50cqh]" />
                <Reel className="left-[calc(100%-50cqh)]" />
              </div>
            </div>

            <div className="absolute right-4 bottom-4 left-4 z-5 grid gap-y-1.5">
              <Slider.Root
                min={0}
                max={Math.max(duration, 0.01)}
                step={0.01}
                disabled={duration <= 0}
                value={[Math.min(currentTime, Math.max(duration, 0.01))]}
                onValueChange={([next]) => seek(next)}
                onValueCommit={endScrubbing}
                onPointerDown={startScrubbing}
                className="relative flex h-6 w-full touch-none items-center select-none data-[disabled]:cursor-default"
                aria-label={`Seek through ${trackTitle}`}
              >
                <Slider.Track className="relative h-[3px] w-full grow translate-y-0.5 rounded-full bg-[color-mix(in_srgb,var(--label-ink)_28%,transparent)]">
                  <Slider.Range className="absolute h-full rounded-full bg-[var(--label-ink)]" />
                </Slider.Track>
                <Slider.Thumb
                  aria-label={`Seek through ${trackTitle}`}
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  className="block size-[13px] translate-y-0.5 cursor-pointer rounded-full border-2 border-[var(--thumb-ring)] bg-white shadow-[0_1px_4px_rgba(37,33,29,0.38)] outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--label-ink)]"
                />
              </Slider.Root>

              <div className="relative z-2 flex items-baseline justify-between font-sans text-xs leading-4 font-normal tabular-nums">
                <span>
                  <span className="sr-only">Elapsed time </span>
                  <time dateTime={formatDuration(currentTime)}>{formatTime(currentTime)}</time>
                </span>
                <span>
                  <span className="sr-only">Total time </span>
                  <time dateTime={formatDuration(duration)}>{formatTime(duration)}</time>
                </span>
              </div>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute -inset-1 z-10 rounded-[inherit] border-4 border-[var(--label-border)]"
            />
          </div>

          {/* The moulded shelf the buttons sit in, tapered at both ends. */}
          <div className="absolute right-[27%] bottom-[3.5%] left-[27%] z-4 grid h-[16%] grid-cols-[1fr_auto_1fr] place-items-center gap-x-[clamp(6px,1.5cqw,10px)] bg-[color-mix(in_srgb,#63635e_20%,transparent)] px-[12%] shadow-[inset_0_3px_8px_rgba(0,0,0,0.5)] [clip-path:polygon(13%_0,87%_0,100%_100%,0_100%)]">
            <button
              type="button"
              onClick={restart}
              disabled={currentTime <= 0}
              aria-label="Restart track"
              className={cn(
                BUTTON,
                "w-[clamp(24px,6.5cqw,32px)] border-[#82827c] bg-[#63635e] shadow-[0_2px_5px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#7c7b74]"
              )}
            >
              <RotateCcw aria-hidden className="size-4" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? `Pause ${trackTitle}` : `Play ${trackTitle}`}
              className={cn(
                BUTTON,
                "w-[clamp(30px,8.2cqw,43px)] border-[#bcbbb5]/50 bg-[#8d8d86] shadow-[0_3px_8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[#82827c]"
              )}
            >
              {isPlaying ? (
                <Pause aria-hidden className="size-[18px] fill-current" strokeWidth={0} />
              ) : (
                <Play aria-hidden className="size-[18px] translate-x-px fill-current" strokeWidth={0} />
              )}
            </button>

            <button
              type="button"
              onClick={() => changeVolume(muted ? lastVolume || DEFAULT_VOLUME : 0)}
              aria-label={muted ? "Unmute" : "Mute"}
              className={cn(
                BUTTON,
                "w-[clamp(24px,6.5cqw,32px)] border-[#82827c] bg-[#63635e] shadow-[0_2px_5px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#7c7b74]"
              )}
            >
              {muted ? (
                <VolumeX aria-hidden className="size-4" strokeWidth={2.25} />
              ) : (
                <Volume2 aria-hidden className="size-4" strokeWidth={2.25} />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-center text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  )
}
