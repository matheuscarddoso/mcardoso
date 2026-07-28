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

/** "UTC-3" — read from the zone itself, so a DST change would follow along. */
function offsetLabel(date: Date): string {
  try {
    const name = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      timeZoneName: "shortOffset",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value
    if (name) return name.replace("GMT", "UTC")
  } catch {
    // `shortOffset` predates Safari 15.4 — fall through to the manual read.
  }

  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const zoned = new Date(date.toLocaleString("en-US", { timeZone: TIME_ZONE }))
  const hours = Math.round((zoned.getTime() - utc.getTime()) / 3_600_000)
  return `UTC${hours < 0 ? "-" : "+"}${Math.abs(hours)}`
}

function readClock(): Clock {
  const now = new Date()
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
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

export function LocalTime({ language }: { language: Language }) {
  // Null until mounted: the server has no business guessing the viewer's clock,
  // and rendering one would desync on hydration.
  const [clock, setClock] = React.useState<Clock | null>(null)

  React.useEffect(() => {
    setClock(readClock())

    const id = setInterval(() => {
      setClock((previous) => {
        const next = readClock()
        // Only the displayed minute matters — skip the other 59 re-renders.
        return previous && previous.hour === next.hour && previous.minute === next.minute
          ? previous
          : next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col gap-0.5 text-xs select-none">
      <span className="text-primary-light-11 dark:text-primary-dark-11">{motto[language]}</span>
      <span
        // Placeholder holds the width so the footer doesn't jump on mount.
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
