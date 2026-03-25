"use client"

import * as React from "react"

export function ColorExplorer() {
  const [lightness, setLightness] = React.useState(0.7)
  const [chroma, setChroma] = React.useState(0.15)
  const [hue, setHue] = React.useState(280)

  return (
    <div className="my-8 flex w-full flex-col items-center">
      <div className="preview-card flex w-full flex-col gap-6 p-6">
        <div
          className="h-32 w-full rounded-lg outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
          style={{ backgroundColor: `oklch(${lightness} ${chroma} ${hue})` }}
        />

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-foreground">Lightness</span>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">{lightness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={lightness}
              onChange={(e) => setLightness(parseFloat(e.target.value))}
              className="w-full accent-foreground"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-foreground">Chroma</span>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">{chroma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.01"
              value={chroma}
              onChange={(e) => setChroma(parseFloat(e.target.value))}
              className="w-full accent-foreground"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-foreground">Hue</span>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={hue}
              onChange={(e) => setHue(parseInt(e.target.value))}
              className="w-full accent-foreground"
            />
          </label>
        </div>

        <div className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[13px] tabular-nums">
          <code>{`oklch(${lightness.toFixed(2)} ${chroma.toFixed(2)} ${hue})`}</code>
        </div>
      </div>
    </div>
  )
}
