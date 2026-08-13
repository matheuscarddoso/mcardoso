"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { previousPath } from "@/lib/visit-trail"

/**
 * The control at the top of an article that returns to the home page.
 *
 * It stays a real link to a real URL, so it is crawlable, and a middle click
 * or a modified click opens it in a tab the way any other link does. What
 * changes is the plain left click: when the reader arrived here from the home
 * page, this steps back through history instead of navigating forward to the
 * same address.
 *
 * The two are not interchangeable. A forward navigation is a new history entry
 * and the App Router starts it at the top of the page, which drops a reader
 * who had scrolled halfway down the writing list back at the beginning of it.
 * Going back restores the position the browser already remembers.
 *
 * The fallback matters as much as the shortcut: opened straight from a search
 * result, there is no home page behind this one, and stepping back would leave
 * the site entirely. Then the href does what it says.
 */
export function HomeLink({
  locale,
  className,
  "aria-label": label,
  children,
}: {
  locale: string
  className?: string
  "aria-label": string
  children: React.ReactNode
}) {
  const router = useRouter()
  const home = `/${locale}`

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    /* Everything the browser has its own meaning for is left alone: a new tab,
       a new window, a download, a middle click. */
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    /* Read at click time, not at render: the trail is module state and changes
       without telling React. */
    if (previousPath() !== home) return

    event.preventDefault()
    router.back()
  }

  return (
    <Link href={home} onClick={onClick} className={className} aria-label={label}>
      {children}
    </Link>
  )
}
