"use client"

import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { MotionConfig, motion, useReducedMotion } from "motion/react"

/**
 * A command palette whose commands take arguments, filled in place.
 *
 * The hard part is not the list, it is focus. "Assign to [person] with
 * [priority]" is a small form, and the obvious build gives every picked value
 * its own focusable element. Tab order, Backspace and screen-reader context all
 * fracture halfway through the command. So building a command never adds a tab
 * stop: the input is the only one, however deep the command goes. Only the
 * footer's two buttons sit beside it, and they are always the same two.
 *
 *   Picking a command collapses it into a chip painted before the input. The
 *   chip is render output, not a field. The list slides to that command's first
 *   argument and the same input now filters its options.
 *
 *   Filling the last argument stages the command as a clause rather than
 *   running it, and the list slides back to what is left, joined by an "and".
 *   One session builds a compound. Nothing runs until Apply.
 *
 *   Backspace on an empty query pops the last chip, across the "and" too. Chips
 *   never enter the tab order but are clickable: clicking one rewinds to that
 *   argument, and the tail dims first to show how much the rewind will take.
 *
 * Matching is a scored subsequence, so "mvp" finds "Move to project", with
 * bonuses for word starts and adjacency and a penalty for gaps. The list's
 * height is measured in pixels and eased, because `auto` does not animate.
 */

const EASE = [0.22, 1, 0.36, 1] as const
const EASE_ICON = [0.2, 0, 0, 1] as const
/** How far a view slides in from, in pixels, when the list changes. */
const SLIDE = 28

export type CommandOption = {
  value: string
  hint?: string
  /** A colour swatch, for options that carry one. */
  dot?: string
}

export type CommandSlot = {
  name: string
  prompt: string
  kind: "person" | "dot" | "plain"
  options: CommandOption[]
}

export type Command = {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string
  danger?: boolean
  slots: CommandSlot[]
  /** The line printed once the compound is applied. */
  message: (values: CommandOption[]) => string
}

/**
 * `useLayoutEffect` warns when React renders on the server, and this component
 * renders on the server like everything else on the page. The measurement it
 * guards only means anything in a browser.
 */
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Walks the query through the text, letter by letter, scoring as it goes.
 *
 * `boundaryFirst` prefers a letter that starts a word over the first one that
 * merely matches, which is what makes "mvp" land on "Move to project" rather
 * than on the "m", "v", "p" it could find inside one word.
 */
function scan(query: string, hay: string, boundaryFirst: boolean) {
  const idx: number[] = []
  let pos = 0
  let score = 0
  let previous = -2

  for (const character of query) {
    let at = -1

    if (boundaryFirst) {
      for (let i = pos; i < hay.length; i += 1) {
        if (hay[i] === character && (i === 0 || hay[i - 1] === " ")) {
          at = i
          break
        }
      }
    }

    if (at === -1) at = hay.indexOf(character, pos)
    if (at === -1) return null

    score += at === 0 || hay[at - 1] === " " ? 10 : 4
    if (at === previous + 1) score += 8
    /* Capped, so one long gap does not outweigh everything the match got
       right before it. */
    score -= Math.min(6, at - pos)

    idx.push(at)
    previous = at
    pos = at + 1
  }

  return { score, idx }
}

function fuzzyMatch(query: string, text: string) {
  const needle = query.toLowerCase().replace(/\s+/g, "")
  if (!needle) return { score: 0, idx: [] }

  const hay = text.toLowerCase()
  const onBoundaries = scan(needle, hay, true)
  const anywhere = scan(needle, hay, false)

  if (!onBoundaries) return anywhere
  if (!anywhere) return onBoundaries
  return onBoundaries.score >= anywhere.score ? onBoundaries : anywhere
}

function substringMatch(query: string, text: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return { score: 0, idx: [] }

  const at = text.toLowerCase().indexOf(needle)
  if (at === -1) return null
  return { score: 100 - at, idx: Array.from({ length: needle.length }, (_, i) => at + i) }
}

/** Underlines the matched letters where they sit; runs of them merge. */
function Highlight({ text, idx }: { text: string; idx: number[] }) {
  if (!idx || idx.length === 0) return <>{text}</>

  const marked = new Set(idx)
  const out: ReactNode[] = []
  let run = ""
  let inRun = marked.has(0)

  for (let i = 0; i <= text.length; i += 1) {
    const now = i < text.length && marked.has(i)

    if (i === text.length || now !== inRun) {
      if (run) {
        out.push(
          inRun ? (
            <span
              key={`m${i}`}
              className="text-foreground underline decoration-muted-foreground/70 decoration-1 underline-offset-[3px] group-data-[danger=true]/opt:group-data-[active=true]/opt:text-inherit"
            >
              {run}
            </span>
          ) : (
            <Fragment key={`t${i}`}>{run}</Fragment>
          )
        )
      }
      run = ""
      inRun = now
    }

    if (i < text.length) run += text[i]
  }

  return <>{out}</>
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

type Clause = { command: Command; values: CommandOption[] }
type Row = { item: CommandOption | Command; idx: number[]; score: number; order: number }

const labelOf = (item: CommandOption | Command) => ("label" in item ? item.label : item.value)

export function CommandPalette({
  commands,
  matcher = "fuzzy",
  morph = true,
  onApply,
}: {
  commands: Command[]
  /** "fuzzy" is a scored subsequence; "substring" is a plain indexOf. */
  matcher?: "fuzzy" | "substring"
  morph?: boolean
  /** Runs when Apply, or Cmd+Enter, commits the staged clauses. */
  onApply?: (clauses: { command: Command; values: CommandOption[] }[]) => void
}) {
  const [query, setQuery] = useState("")
  const [command, setCommand] = useState<Command | null>(null)
  const [slotIndex, setSlotIndex] = useState(0)
  const [values, setValues] = useState<CommandOption[]>([])
  const [clauses, setClauses] = useState<Clause[]>([])
  const [active, setActive] = useState(0)
  const [bodyHeight, setBodyHeight] = useState<number | null>(null)
  const [leaving, setLeaving] = useState<{
    rows: Row[]
    ctx: { command: Command | null; slotIndex: number }
    dir: number
  } | null>(null)
  const [ran, setRan] = useState<{ message: string } | null>(null)
  const [lastRun, setLastRun] = useState<string | null>(null)
  const [hoveredChip, setHoveredChip] = useState<number | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const leaveTimer = useRef<number>(0)
  const ranTimer = useRef<number>(0)
  /**
   * False until the first measurement has landed.
   *
   * State and not a ref, deliberately: the render below reads it to decide
   * whether the height animates, and a ref read during render is a value React
   * never promised would be current.
   */
  const [measured, setMeasured] = useState(false)
  const listboxId = useId()
  const reduced = useReducedMotion()

  const slot = command ? command.slots[slotIndex] : null
  const stagedIds = useMemo(() => new Set(clauses.map((clause) => clause.command.id)), [clauses])
  const items = useMemo<(CommandOption | Command)[]>(
    () => (slot ? slot.options : commands.filter((entry) => !stagedIds.has(entry.id))),
    [slot, commands, stagedIds]
  )
  /* Changing this key is what remounts the view and plays the slide. */
  const viewKey = command ? `${command.id}:${slotIndex}` : "root"

  const matches = useMemo<Row[]>(() => {
    const match = matcher === "fuzzy" ? fuzzyMatch : substringMatch
    const out: Row[] = []

    items.forEach((item, order) => {
      const hit = match(query, labelOf(item))
      if (hit) out.push({ item, idx: hit.idx, score: hit.score, order })
    })

    /* Score first, then the order they were declared in, so an unfiltered
       list reads the way the author wrote it. */
    out.sort((a, b) => b.score - a.score || a.order - b.order)
    return out
  }, [items, query, matcher])

  const activeSafe = Math.min(active, Math.max(0, matches.length - 1))

  const chipGroups = [
    ...clauses.map((clause, index) => ({
      key: `clause-${index}`,
      chips: [
        { key: "cmd", label: clause.command.label, kind: "cmd" as const, dot: undefined as string | undefined },
        ...clause.values.map((value, i) => ({
          key: `v${i}`,
          label: value.value,
          kind: "val" as const,
          dot: value.dot,
        })),
      ],
    })),
    ...(command
      ? [
          {
            key: "live",
            chips: [
              { key: "cmd", label: command.label, kind: "cmd" as const, dot: undefined as string | undefined },
              ...values.map((value, i) => ({
                key: `v${i}`,
                label: value.value,
                kind: "val" as const,
                dot: value.dot,
              })),
            ],
          },
        ]
      : []),
  ]
  const chips = chipGroups.flatMap((group) => group.chips.map((chip) => chip.label))

  /**
   * Every move between views goes through here: it parks the outgoing rows so
   * they can slide away while the incoming ones slide in, then clears the
   * query, because the text that found a command means nothing to its
   * arguments.
   */
  function shift(dir: number, mutate: () => void) {
    if (morph && !reduced) {
      setLeaving({ rows: matches, ctx: { command, slotIndex }, dir })
      clearTimeout(leaveTimer.current)
      leaveTimer.current = window.setTimeout(() => setLeaving(null), 320)
    }

    mutate()
    setQuery("")
    setActive(0)
  }

  function stageClause(cmd: Command, vals: CommandOption[]) {
    shift(1, () => {
      setClauses((list) => [...list, { command: cmd, values: vals }])
      setCommand(null)
      setSlotIndex(0)
      setValues([])
    })
  }

  function applyAll() {
    if (clauses.length === 0 || command) return

    const message = clauses.map((clause) => clause.command.message(clause.values)).join(" · ")
    onApply?.(clauses.map((clause) => ({ command: clause.command, values: clause.values })))

    setRan({ message })
    setLastRun(message)
    clearTimeout(ranTimer.current)
    ranTimer.current = window.setTimeout(() => setRan(null), 1600)

    setClauses([])
    setQuery("")
    setActive(0)
  }

  function clearAll() {
    if (command) {
      shift(-1, () => {
        setCommand(null)
        setSlotIndex(0)
        setValues([])
        setClauses([])
      })
      return
    }

    setClauses([])
    setQuery("")
    setActive(0)
  }

  function pick(item: CommandOption | Command) {
    if (!command) {
      const cmd = item as Command
      /* A command with no arguments has nothing to ask, so it stages at once. */
      if (cmd.slots.length === 0) {
        stageClause(cmd, [])
        return
      }

      shift(1, () => {
        setCommand(cmd)
        setSlotIndex(0)
        setValues([])
      })
      return
    }

    if (slotIndex + 1 < command.slots.length) {
      shift(1, () => {
        setValues((list) => [...list, item as CommandOption])
        setSlotIndex(slotIndex + 1)
      })
      return
    }

    stageClause(command, [...values, item as CommandOption])
  }

  /** Undoes exactly one step, whatever that step was. */
  function popChip() {
    if (command) {
      if (slotIndex > 0) {
        shift(-1, () => {
          setValues((list) => list.slice(0, -1))
          setSlotIndex(slotIndex - 1)
        })
        return
      }

      shift(-1, () => {
        setCommand(null)
        setValues([])
      })
      return
    }

    if (clauses.length === 0) return

    const last = clauses[clauses.length - 1]

    if (last.command.slots.length === 0) {
      setClauses((list) => list.slice(0, -1))
      setActive(0)
      return
    }

    /* Reopens the clause at its final argument, so Backspace walks back into
       the command rather than deleting it whole. */
    shift(-1, () => {
      setClauses((list) => list.slice(0, -1))
      setCommand(last.command)
      setSlotIndex(last.command.slots.length - 1)
      setValues(last.values.slice(0, -1))
    })
  }

  function editChip(groupIndex: number, chipIndex: number) {
    const keep = clauses.slice(0, groupIndex)
    const isLive = command !== null && groupIndex === clauses.length
    const cmd = isLive ? command : clauses[groupIndex].command
    const vals = isLive ? values : clauses[groupIndex].values

    if (chipIndex === 0) {
      if (!command) {
        setClauses(keep)
        setQuery("")
        setActive(0)
        return
      }

      shift(-1, () => {
        setClauses(keep)
        setCommand(null)
        setSlotIndex(0)
        setValues([])
      })
      return
    }

    shift(-1, () => {
      setClauses(keep)
      setCommand(cmd)
      setSlotIndex(chipIndex - 1)
      setValues(vals.slice(0, chipIndex - 1))
    })
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (matches.length) setActive((i) => (Math.min(i, matches.length - 1) + 1) % matches.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (matches.length) {
        setActive((i) => (Math.min(i, matches.length - 1) - 1 + matches.length) % matches.length)
      }
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      if (event.metaKey || event.ctrlKey) {
        applyAll()
        return
      }
      const hit = matches[activeSafe]
      if (hit) pick(hit.item)
      return
    }

    /* Only on an empty query: while there is text, Backspace is still
       Backspace. */
    if (event.key === "Backspace" && query === "" && (command || clauses.length > 0)) {
      event.preventDefault()
      popChip()
      return
    }

    if (event.key === "Escape") {
      if (query !== "") {
        event.preventDefault()
        setQuery("")
        setActive(0)
        return
      }
      if (command || clauses.length > 0) {
        event.preventDefault()
        popChip()
      }
    }
  }

  /* `height: auto` does not animate, so the live view is measured and the
     number is what gets eased. */
  useBrowserLayoutEffect(() => {
    const view = viewRef.current
    if (!view) return undefined

    const measure = () => setBodyHeight(view.offsetHeight)
    measure()
    /* The first measurement is the initial layout, not a change, and must not
       animate up from zero. A frame later, every change is a real one. */
    const frame = requestAnimationFrame(() => setMeasured(true))

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null
    observer?.observe(view)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [viewKey, matches.length])

  /* Keeps the keyboard selection inside the capped list. */
  useEffect(() => {
    const list = listRef.current
    const node = list?.children[activeSafe] as HTMLElement | undefined
    if (!list || !node) return

    if (node.offsetTop < list.scrollTop) {
      list.scrollTop = node.offsetTop
    } else if (node.offsetTop + node.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = node.offsetTop + node.offsetHeight - list.clientHeight
    }
  }, [activeSafe, viewKey])

  useEffect(
    () => () => {
      clearTimeout(leaveTimer.current)
      clearTimeout(ranTimer.current)
    },
    []
  )

  function renderRows(
    rows: Row[],
    ctx: { command: Command | null; slotIndex: number },
    live: boolean
  ) {
    if (rows.length === 0) {
      return (
        <div className="flex flex-col items-center gap-1 px-3 py-[1.125rem] text-center text-[0.8125rem] text-muted-foreground/70">
          {query === "" ? (
            <>
              Everything staged
              <span className="text-[0.6875rem]">Apply runs it all · Backspace pops a chip</span>
            </>
          ) : (
            <>
              No matches for <span className="text-muted-foreground">&ldquo;{query}&rdquo;</span>
              <span className="text-[0.6875rem]">
                Esc clears{ctx.command || clauses.length > 0 ? " · Backspace pops a chip" : ""}
              </span>
            </>
          )}
        </div>
      )
    }

    const kind = ctx.command ? ctx.command.slots[ctx.slotIndex].kind : "command"

    return (
      <ul
        role={live ? "listbox" : undefined}
        id={live ? listboxId : undefined}
        aria-label={
          live ? (ctx.command ? ctx.command.slots[ctx.slotIndex].prompt : "Commands") : undefined
        }
        ref={live ? listRef : undefined}
        className="m-0 flex max-h-[13.5rem] list-none flex-col gap-px overflow-y-auto p-0"
      >
        {rows.map((row, index) => {
          const isCommand = "label" in row.item

          return (
            <li
              key={labelOf(row.item)}
              id={live ? `${listboxId}-${index}` : undefined}
              role={live ? "option" : undefined}
              aria-selected={live ? index === activeSafe : undefined}
              data-active={live && index === activeSafe ? "true" : undefined}
              data-danger={isCommand && (row.item as Command).danger ? "true" : undefined}
              className="group/opt flex cursor-pointer items-center gap-2 rounded-lg px-2 py-[0.4375rem] text-[0.8125rem] text-foreground/80 data-[active=true]:bg-accent data-[active=true]:text-foreground data-[danger=true]:data-[active=true]:bg-destructive/10 data-[danger=true]:data-[active=true]:text-destructive"
              /* `mousedown`, not `click`: the input must never lose focus, and
                 preventing the default is what stops the blur. */
              onMouseDown={
                live
                  ? (event) => {
                      event.preventDefault()
                      pick(row.item)
                    }
                  : undefined
              }
              onMouseMove={live ? () => setActive(index) : undefined}
            >
              {kind === "command" && (
                <span className="inline-flex flex-none text-muted-foreground/70 group-data-[active=true]/opt:text-muted-foreground group-data-[danger=true]/opt:group-data-[active=true]/opt:text-destructive">
                  {(row.item as Command).icon}
                </span>
              )}
              {kind === "person" && (
                <span
                  aria-hidden
                  className="inline-flex h-[1.375rem] w-[1.375rem] flex-none items-center justify-center rounded-full bg-foreground/10 text-[0.5625rem] font-semibold tracking-[0.02em] text-foreground/70"
                >
                  {initials((row.item as CommandOption).value)}
                </span>
              )}
              {kind === "dot" && (
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 flex-none rounded-full"
                  style={{
                    background: (row.item as CommandOption).dot ?? "var(--color-muted-foreground)",
                  }}
                />
              )}
              {kind === "plain" && (
                <span className="inline-flex flex-none text-muted-foreground/70 group-data-[active=true]/opt:text-muted-foreground">
                  {ctx.command?.icon}
                </span>
              )}

              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                <Highlight text={labelOf(row.item)} idx={row.idx} />
              </span>

              {"hint" in row.item && row.item.hint && (
                <span className="flex-none text-[0.6875rem] text-muted-foreground/70">
                  {row.item.hint}
                </span>
              )}

              {isCommand && (row.item as Command).shortcut ? (
                <kbd
                  aria-hidden
                  className="inline-flex min-w-4 items-center justify-center rounded px-1 font-mono text-[0.625rem] leading-normal text-muted-foreground inset-ring inset-ring-foreground/10 group-data-[active=true]/opt:bg-background group-data-[active=true]/opt:inset-ring-0"
                >
                  {(row.item as Command).shortcut}
                </kbd>
              ) : (
                <kbd
                  aria-hidden
                  className="inline-flex min-w-4 items-center justify-center rounded bg-muted px-1 font-mono text-[0.625rem] leading-normal text-muted-foreground opacity-0 group-data-[active=true]/opt:opacity-100"
                >
                  ↵
                </kbd>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  /* Counts chips across the "and" boundaries, so hovering one can dim
     everything that comes after it. */
  let flat = -1

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative w-full max-w-[24rem]">
        <div className="overflow-hidden rounded-xl bg-popover shadow-custom ring-1 ring-border">
          <div
            className="flex cursor-text flex-wrap items-center gap-1.5 border-b border-border px-3 py-2.5"
            onClick={() => inputRef.current?.focus()}
          >
            <span aria-hidden className="inline-flex flex-none text-muted-foreground/70">
              <SearchIcon />
            </span>

            {chipGroups.map((group, groupIndex) => (
              <Fragment key={group.key}>
                {groupIndex > 0 &&
                  (() => {
                    flat += 1
                    const mine = flat
                    return (
                      <span
                        className="flex-none text-[0.6875rem] font-medium text-muted-foreground/70 transition-opacity duration-[240ms]"
                        style={{ opacity: hoveredChip != null && mine > hoveredChip ? 0.35 : 1 }}
                      >
                        and
                      </span>
                    )
                  })()}

                {group.chips.map((chip, chipIndex) => {
                  flat += 1
                  const mine = flat
                  const isLast =
                    groupIndex === chipGroups.length - 1 && chipIndex === group.chips.length - 1

                  return (
                    <span
                      key={`${group.key}-${chip.key}`}
                      className="inline-flex transition-opacity duration-[240ms]"
                      style={{ opacity: hoveredChip != null && mine > hoveredChip ? 0.35 : 1 }}
                    >
                      <motion.button
                        type="button"
                        /* Out of the tab order on purpose. The whole design is
                           one tab stop; these are shortcuts for a pointer. */
                        tabIndex={-1}
                        initial={morph && !reduced ? { opacity: 0, scale: 0.85, filter: "blur(2px)" } : false}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.24, ease: EASE }}
                        aria-label={`${chip.kind === "cmd" ? "Remove" : "Change"} ${chip.label}${
                          isLast ? "" : ", also removes later chips"
                        }`}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setHoveredChip(mine)}
                        onMouseLeave={() => setHoveredChip(null)}
                        onClick={() => editChip(groupIndex, chipIndex)}
                        className={`inline-flex min-w-0 cursor-pointer items-center gap-[0.3125rem] overflow-hidden rounded-md px-[0.4375rem] py-[0.1875rem] text-xs font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.96] ${
                          chip.kind === "cmd"
                            ? "bg-primary text-primary-foreground hover:bg-primary/85"
                            : "bg-muted text-foreground hover:bg-foreground/10"
                        }`}
                      >
                        {chip.dot && (
                          <span
                            aria-hidden
                            className="inline-block h-2 w-2 flex-none rounded-full"
                            style={{ background: chip.dot }}
                          />
                        )}
                        {chip.label}
                      </motion.button>
                    </span>
                  )
                })}
              </Fragment>
            ))}

            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder={slot ? slot.prompt : "Type a command"}
              aria-label={slot ? slot.prompt : "Type a command"}
              role="combobox"
              aria-expanded
              aria-controls={listboxId}
              aria-activedescendant={matches.length ? `${listboxId}-${activeSafe}` : undefined}
              aria-autocomplete="list"
              aria-describedby={chips.length > 0 ? `${listboxId}-trail` : undefined}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={handleKeyDown}
              className="min-w-[5rem] flex-1 border-0 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />

            {/* The chips are not in the tab order, so this is how a screen
                reader learns what has been built so far. */}
            <span id={`${listboxId}-trail`} className="sr-only">
              {chips.length > 0
                ? `Building: ${chipGroups
                    .map((group) => group.chips.map((chip) => chip.label).join(" "))
                    .join(", and ")}. Backspace removes the last chip.`
                : ""}
            </span>
          </div>

          <motion.div
            className="relative overflow-hidden"
            animate={{ height: bodyHeight ?? "auto" }}
            transition={
              !morph || reduced || !measured ? { duration: 0 } : { duration: 0.3, ease: EASE }
            }
          >
            {leaving && morph && !reduced && (
              <motion.div
                aria-hidden
                inert
                className="pointer-events-none absolute top-0 left-0 w-full p-1"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: -leaving.dir * SLIDE, opacity: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                {renderRows(leaving.rows, leaving.ctx, false)}
              </motion.div>
            )}

            <motion.div
              key={viewKey}
              ref={viewRef}
              className="p-1"
              initial={
                leaving && morph && !reduced
                  ? { x: leaving.dir * SLIDE, opacity: 0, filter: "blur(2px)" }
                  : false
              }
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {renderRows(matches, { command, slotIndex }, true)}
            </motion.div>
          </motion.div>

          <div className="relative flex min-h-8 items-center justify-between gap-2 border-t border-border px-3 py-[0.4375rem] text-[0.6875rem] text-muted-foreground/70">
            <motion.span
              className="inline-flex items-center gap-[0.3125rem]"
              animate={ran ? { opacity: 0, y: -4, filter: "blur(2px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.25, ease: EASE_ICON }}
              style={{ pointerEvents: ran ? "none" : undefined }}
            >
              {command ? (
                <>
                  {command.label} · {command.slots[slotIndex].name} {slotIndex + 1} of{" "}
                  {command.slots.length}
                </>
              ) : clauses.length > 0 ? (
                <>
                  <span className="tabular-nums">{clauses.length}</span> staged · add another or
                  apply
                </>
              ) : (
                <>{commands.length} commands</>
              )}
            </motion.span>

            <motion.span
              className="inline-flex items-center gap-3"
              animate={ran ? { opacity: 0, y: -4, filter: "blur(2px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.25, ease: EASE_ICON }}
              style={{ pointerEvents: ran ? "none" : undefined }}
            >
              <button
                type="button"
                disabled={clauses.length === 0 && !command && query === ""}
                aria-label="Clear staged commands"
                onMouseDown={(event) => event.preventDefault()}
                onClick={clearAll}
                className="relative inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-muted-foreground/70 transition-[background-color,color,opacity,scale] duration-150 after:absolute after:-inset-1.5 after:content-[''] hover:enabled:bg-accent hover:enabled:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:enabled:scale-[0.96] disabled:cursor-default disabled:opacity-35"
              >
                <XIcon />
              </button>

              <button
                type="button"
                disabled={clauses.length === 0 || command !== null}
                aria-label={`Apply ${clauses.length} staged ${clauses.length === 1 ? "command" : "commands"}`}
                aria-keyshortcuts="Meta+Enter Control+Enter"
                title="⌘⏎"
                onMouseDown={(event) => event.preventDefault()}
                onClick={applyAll}
                className="relative inline-flex h-7 cursor-pointer items-center gap-[0.3125rem] rounded-[0.4375rem] bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-[background-color,color,scale] duration-150 after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:enabled:scale-[0.96] disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground/70 disabled:[&_[data-n]]:bg-foreground/[0.06]"
              >
                <CheckIcon />
                Apply
                {clauses.length > 0 && (
                  <span
                    data-n
                    className="inline-flex min-w-4 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/[0.18] px-1 text-[0.625rem] leading-normal tabular-nums"
                  >
                    {clauses.length}
                  </span>
                )}
              </button>
            </motion.span>

            {/* Overlaid rather than swapped in: the footer must not change
                height when the result arrives. */}
            <motion.span
              aria-hidden={!ran}
              className="absolute inset-0 flex items-center gap-1.5 px-3 font-medium text-foreground"
              initial={false}
              animate={ran ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 4, filter: "blur(2px)" }}
              transition={{ duration: 0.25, ease: EASE_ICON }}
              style={{ pointerEvents: "none" }}
            >
              <span className="inline-flex flex-none text-[#16a34a]">
                <CheckIcon />
              </span>
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {ran?.message ?? lastRun}
              </span>
            </motion.span>
          </div>
        </div>

        <span className="sr-only" aria-live="polite">
          {ran
            ? `Applied: ${ran.message}`
            : `${slot ? `${slot.prompt}: ` : ""}${matches.length} ${
                matches.length === 1 ? "result" : "results"
              }${clauses.length > 0 ? `, ${clauses.length} staged` : ""}`}
        </span>
      </div>
    </MotionConfig>
  )
}

function Svg({ children, size = 15 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function SearchIcon() {
  return (
    <Svg size={16}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  )
}

function CheckIcon() {
  return (
    <Svg size={13}>
      <path d="M20 6 9 17l-5-5" strokeWidth="2.5" />
    </Svg>
  )
}

function XIcon() {
  return (
    <Svg size={13}>
      <path d="M18 6 6 18M6 6l12 12" strokeWidth="2.5" />
    </Svg>
  )
}
