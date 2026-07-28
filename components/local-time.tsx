"use client"

import * as React from "react"
import type { Language } from "@/lib/locale"

const TIME_ZONE = "America/Sao_Paulo"

const motto = {
  PT: "Consistência é tudo",
  EN: "Consistency is key",
  ES: "La consistencia es clave",
} as const

type Clock = {
  hour: string
  minute: string
  dayPeriod: string
  offset: string
}

/*
 * `Intl.DateTimeFormat` is expensive to construct and stateless once built, so
 * both formatters are made once and reused. They used to be rebuilt on every
 * tick — sixty constructions a minute on the main thread, for a value that
 * changes once.
 *
 * Lazily, not at module scope: `shortOffset` throws on older engines, and that
 * has to degrade to the fallback below rather than fail the import.
 */
let clockFormat: Intl.DateTimeFormat | undefined
let offsetFormat: Intl.DateTimeFormat | null | undefined

function clockFormatter(): Intl.DateTimeFormat {
  return (clockFormat ??= new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }))
}

function offsetFormatter(): Intl.DateTimeFormat | null {
  if (offsetFormat === undefined) {
    try {
      offsetFormat = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        timeZoneName: "shortOffset",
      })
    } catch {
      offsetFormat = null
    }
  }
  return offsetFormat
}

/** "UTC-3" — read from the zone itself, so a DST change would follow along. */
function offsetLabel(date: Date): string {
  const name = offsetFormatter()
    ?.formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value
  if (name) return name.replace("GMT", "UTC")

  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const zoned = new Date(date.toLocaleString("en-US", { timeZone: TIME_ZONE }))
  const hours = Math.round((zoned.getTime() - utc.getTime()) / 3_600_000)
  return `UTC${hours < 0 ? "-" : "+"}${Math.abs(hours)}`
}

function readClock(): Clock {
  const now = new Date()
  const parts = Object.fromEntries(
    clockFormatter()
      .formatToParts(now)
      .map((part) => [part.type, part.value])
  )

  return {
    hour: parts.hour ?? "--",
    minute: parts.minute ?? "--",
    dayPeriod: (parts.dayPeriod ?? "").toUpperCase(),
    offset: offsetLabel(now),
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
      setClock(readClock())
      // Re-derived each time rather than accumulated, so drift can't build up.
      timeout = setTimeout(tick, MINUTE - (Date.now() % MINUTE) + 50)
    }

    tick()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col gap-0.5 text-xs select-none">
      <span className="text-primary-light-11 dark:text-primary-dark-11">{motto[language]}</span>
      <span
        className={`flex items-baseline gap-0.5 ${clock ? "" : "invisible"}`}
      >
        <span className="tabular-nums text-gray-1200">{clock?.hour ?? "00"}</span>
        <span className="tabular-nums text-gray-1200">:{clock?.minute ?? "00"}</span>
        <span className="ml-1 text-gray-1000">
          {clock?.dayPeriod ?? "AM"} {clock?.offset ?? "UTC-3"}
        </span>
      </span>
    </div>
  )
}
