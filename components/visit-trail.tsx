"use client"

import { useVisitTrail } from "@/lib/visit-trail"

/**
 * Records every page the reader opens in this tab. Renders nothing.
 *
 * Mounted in the layout rather than in the one component that reads the trail,
 * because the page a reader came *from* has to have been recorded while they
 * were on it, and by then nothing on the article has mounted yet.
 */
export function VisitTrail() {
  useVisitTrail()
  return null
}
