"use client";

import * as React from "react";
import { Check, LinkIcon } from "lucide-react";

/**
 * Shared by every article. It lived as a copy in each one, and one copy lost
 * its link glyph, which left an empty disc in that article's header.
 */
export function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="group relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
      aria-label="Copy link"
    >
      <span className="relative grid size-4 place-items-center">
        <Check
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 1 : 0,
            transform: copied ? "scale(1)" : "scale(0.25)",
            filter: copied ? "blur(0px)" : "blur(4px)",
          }}
          strokeWidth={1.5}
        />
        <LinkIcon
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 0 : 1,
            transform: copied ? "scale(0.25)" : "scale(1)",
            filter: copied ? "blur(4px)" : "blur(0px)",
          }}
          strokeWidth={1.5}
        />
      </span>
    </button>
  );
}
