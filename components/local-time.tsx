"use client"

import * as React from "react"
import type { Language } from "@/lib/locale"

const TIME_ZONE = "America/Sao_Paulo"

/** Goiânia keeps São Paulo's clock; Goiás has had no DST of its own since 2019. */
const PLACE = "Goiânia, Goiás"

/** Kept apart from the time so tabular figures can wrap the clock alone. */
const preposition = { PT: "em", EN: "in", ES: "en" } as const

/** Brazil writes the time on a 24-hour clock; the other two locales don't. */
const TWENTY_FOUR_HOUR: Record<Language, boolean> = { PT: true, EN: false, ES: false }

type Clock = {
  hour: string
  minute: string
  /** Empty on a 24-hour clock. */
  dayPeriod: string
}

/*
 * `Intl.DateTimeFormat` is expensive to construct and stateless once built, so
 * formatters are made once and reused. They used to be rebuilt on every tick:
 * sixty constructions a minute on the main thread, for a value that changes
 * once. Keyed by language now, since the two clocks are different formats.
 */
const formatters = new Map<Language, Intl.DateTimeFormat>()

function clockFormatter(language: Language): Intl.DateTimeFormat {
  const cached = formatters.get(language)
  if (cached) return cached

  const isDay = TWENTY_FOUR_HOUR[language]
  const format = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    /*
     * Zero-padded on a 24-hour clock, bare on a 12-hour one: "09:05" is how
     * 24-hour time is written, and "9:05 AM" is how 12-hour time is.
     */
    hour: isDay ? "2-digit" : "numeric",
    minute: "2-digit",
    /*
     * `hourCycle: h23` rather than `hour12: false`. They are not the same:
     * `hour12: false` maps to the h24 cycle in some ICU builds, which prints
     * midnight as "24:00" instead of "00:00".
     */
    ...(isDay ? { hourCycle: "h23" as const } : { hour12: true }),
  })

  formatters.set(language, format)
  return format
}

function readClock(language: Language): Clock {
  const parts = Object.fromEntries(
    clockFormatter(language)
      .formatToParts(new Date())
      .map((part) => [part.type, part.value])
  )

  return {
    hour: parts.hour ?? "--",
    minute: parts.minute ?? "--",
    dayPeriod: parts.dayPeriod ?? "",
  }
}

const MINUTE = 60_000

export function LocalTime({ language }: { language: Language }) {
  const [clock, setClock] = React.useState<Clock | null>(null)

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    /*
     * Wakes on the minute boundary instead of every second. The display only
     * has minute resolution, so a 1s interval was 59 wasted main-thread tasks
     * a minute — each one competing with a tap for the same thread.
     */
    const tick = () => {
      setClock(readClock(language))
      // Re-derived each time rather than accumulated, so drift can't build up.
      timeout = setTimeout(tick, MINUTE - (Date.now() % MINUTE) + 50)
    }

    tick()
    return () => clearTimeout(timeout)
    // Re-reads on a language switch, which is what changes the clock's format.
  }, [language])

  const isDay = TWENTY_FOUR_HOUR[language]
  const placeholder = isDay ? { hour: "00", minute: "00", period: "" } : { hour: "12", minute: "00", period: " AM" }
  const period = clock ? (clock.dayPeriod ? ` ${clock.dayPeriod.toUpperCase()}` : "") : placeholder.period
  const time = `${clock?.hour ?? placeholder.hour}:${clock?.minute ?? placeholder.minute}${period}`

  return (
    /*
     * Hidden rather than absent until the clock is read. The server renders in
     * whatever zone the build machine is in, so printing a time during SSR is
     * a hydration mismatch waiting to happen. `invisible` holds the line's
     * space, so nothing below it moves when the real time arrives.
     */
    <span className={`text-sm font-normal select-none ${clock ? "" : "invisible"}`}>
      {/* Tabular figures only on the clock: without them the line twitches
          sideways every minute as digit widths change. */}
      <span className="tabular-nums">{time}</span>
      {` ${preposition[language]} ${PLACE}`}
    </span>
  )
}
