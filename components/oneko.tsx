"use client"

import * as React from "react"

/**
 * The cat that follows the cursor.
 *
 * A port of oneko.js by adryd (MIT, © 2022), itself a descendant of the Neko
 * toy that has been chasing pointers since the late eighties. The sprite sheet
 * is vendored beside this file's asset with its licence; the logic is rewritten
 * here rather than script-tagged so it mounts and unmounts with React and does
 * not leak a listener or an animation frame on navigation.
 *
 * https://github.com/adryd325/oneko.js
 */

/** Sprite sheet is a 8x4 grid of 32px cells, addressed in cell coordinates. */
const CELL = 32
const SPRITE_URL = "/oneko/oneko.gif"

/** How far the cat travels per tick, in pixels. */
const SPEED = 10
/** It stops this close rather than sitting on the cursor. */
const COMFORT = 48
/** One frame every 100ms, which is the cadence the sprites were drawn for. */
const FRAME_MS = 100

const SPRITES = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
} as const satisfies Record<string, readonly (readonly [number, number])[]>

type SpriteName = keyof typeof SPRITES

export function Oneko() {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    /*
     * A cat that chases the pointer is the definition of decorative motion, so
     * reduced motion means no cat at all rather than a still one. Read inside
     * the effect so the server and the first client render agree.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // No pointer to chase. Touch devices would get a cat parked in a corner.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    let nekoX = 32
    let nekoY = 32
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    let frameCount = 0
    let idleTime = 0
    let idleAnimation: SpriteName | null = null
    let idleAnimationFrame = 0
    let lastTimestamp: number | undefined
    let raf = 0

    const setSprite = (name: SpriteName, frame: number) => {
      const set = SPRITES[name]
      const [x, y] = set[frame % set.length]
      element.style.backgroundPosition = `${x * CELL}px ${y * CELL}px`
    }

    const resetIdle = () => {
      idleAnimation = null
      idleAnimationFrame = 0
    }

    const idle = () => {
      idleTime += 1

      // Roughly every twenty seconds of standing still, it does something.
      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const options: SpriteName[] = ["sleeping", "scratchSelf"]
        // Only scratch a wall it is actually against.
        if (nekoX < 32) options.push("scratchWallW")
        if (nekoY < 32) options.push("scratchWallN")
        if (nekoX > window.innerWidth - 32) options.push("scratchWallE")
        if (nekoY > window.innerHeight - 32) options.push("scratchWallS")
        idleAnimation = options[Math.floor(Math.random() * options.length)]
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0)
            break
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4))
          if (idleAnimationFrame > 192) resetIdle()
          break
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame)
          if (idleAnimationFrame > 9) resetIdle()
          break
        default:
          setSprite("idle", 0)
          return
      }
      idleAnimationFrame += 1
    }

    const step = () => {
      frameCount += 1
      const diffX = nekoX - mouseX
      const diffY = nekoY - mouseY
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2)

      if (distance < SPEED || distance < COMFORT) {
        idle()
        return
      }

      resetIdle()

      // A beat of surprise before it sets off, which is what sells it as alive.
      if (idleTime > 1) {
        setSprite("alert", 0)
        idleTime = Math.min(idleTime, 7) - 1
        return
      }

      // Eight compass sprites, picked by which axes dominate the heading.
      let direction = ""
      if (diffY / distance > 0.5) direction += "N"
      if (diffY / distance < -0.5) direction += "S"
      if (diffX / distance > 0.5) direction += "W"
      if (diffX / distance < -0.5) direction += "E"
      setSprite(direction as SpriteName, frameCount)

      nekoX -= (diffX / distance) * SPEED
      nekoY -= (diffY / distance) * SPEED

      nekoX = Math.min(Math.max(16, nekoX), window.innerWidth - 16)
      nekoY = Math.min(Math.max(16, nekoY), window.innerHeight - 16)

      element.style.left = `${nekoX - 16}px`
      element.style.top = `${nekoY - 16}px`
    }

    const onFrame = (timestamp: number) => {
      // The sprites are drawn for 10fps; running them at display rate would
      // make the walk cycle a blur.
      lastTimestamp ??= timestamp
      if (timestamp - lastTimestamp > FRAME_MS) {
        lastTimestamp = timestamp
        step()
      }
      raf = window.requestAnimationFrame(onFrame)
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
    }

    element.style.left = `${nekoX - 16}px`
    element.style.top = `${nekoY - 16}px`
    document.addEventListener("mousemove", onMouseMove)
    raf = window.requestAnimationFrame(onFrame)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        width: CELL,
        height: CELL,
        backgroundImage: `url(${SPRITE_URL})`,
        // Without this the browser smooths the upscale and the pixel art turns
        // to mush.
        imageRendering: "pixelated",
      }}
      className="pointer-events-none fixed z-50 hidden md:block"
    />
  )
}
