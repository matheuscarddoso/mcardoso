"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

/**
 * Where the reader has been, in this tab, since the document loaded.
 *
 * Module state on purpose. A client navigation in the App Router never
 * reloads the document, so this array outlives every page it records, and it
 * is the only thing on the page that knows whether the previous history entry
 * belongs to this site or to whatever the reader was looking at before.
 *
 * Not `sessionStorage`: two tabs would write over each other's trail, and the
 * question being asked is about one tab's history stack.
 */
const trail: string[] = []

/**
 * The page the reader came from, or `undefined` if this is where they arrived.
 *
 * Read it during an event, never during a render: it changes without telling
 * React, so a component that renders from it will disagree with itself.
 */
export function previousPath(): string | undefined {
  return trail.length > 1 ? trail[trail.length - 2] : undefined
}

/**
 * Records the current path. Mounted once, high in the tree, so it sees every
 * navigation rather than only the ones that happen to remount a subtree.
 *
 * A repeat of the current path is dropped: going back and forth between two
 * pages should leave a trail of two entries alternating, not a run of the same
 * one, and Next re-runs this on renders that are not navigations.
 */
export function useVisitTrail(): void {
  const pathname = usePathname()

  React.useEffect(() => {
    if (trail[trail.length - 1] !== pathname) trail.push(pathname)
  }, [pathname])
}
