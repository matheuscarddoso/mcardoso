import type { Language } from "./locale";

type Localized = Record<Language, string>;

export type CraftFile = {
  /** Printed on the tab. */
  name: string;
  /**
   * Repository-relative path, read at build time. Reading the file rather than
   * repeating it in a string is the only way the listing cannot drift from the
   * component that actually runs on the page above it.
   */
  path?: string;
  /** For a snippet with no file behind it, such as the usage example. */
  code?: string;
  lang: string;
};

export type Craft = {
  slug: string;
  /** ISO date it went up. The sitemap reports it; nothing else reads it. */
  publishedAt: string;
  /**
   * Not localized. It is the component's name, the thing you would type to
   * import it, and translating that would make the page disagree with the code
   * printed on it.
   */
  title: string;
  description: Localized;
  /** Search-result copy; the on-page description is written to sit under a heading. */
  seoDescription: Localized;
  files: CraftFile[];
  /** Printed under the demo, when the demo leans on someone else's work. */
  credit?: Localized;
};

const CASSETTE_USAGE = `import { CassettePlayer } from "@/components/crafts/cassette-player"

export function AudioPlayer() {
  return (
    <CassettePlayer
      audioSrc="/audio/one-small-step.mp3"
      trackTitle="One Small Step"
      archiveLabel="Archive 11"
      catalogueNumber="200769"
    />
  )
}
`;

const LOADING_USAGE = `import { LoadingState } from "@/components/crafts/loading-state"

export function Saving({ pending }: { pending: boolean }) {
  if (!pending) return null
  return <LoadingState label="Saving" variant="drive" />
}
`;

const PALETTE_USAGE = `import {
  CommandPalette,
  type Command,
} from "@/components/crafts/command-palette"

// Commands are data: a label, an icon, a shortcut, and typed argument slots
// with their own options. \`message\` writes the line printed once applied.
const COMMANDS: Command[] = [
  {
    id: "assign",
    label: "Assign to",
    icon: <UserIcon />,
    shortcut: "A",
    slots: [
      { name: "assignee", prompt: "Assign to whom", kind: "person", options: PEOPLE },
      { name: "priority", prompt: "With what priority", kind: "dot", options: PRIORITIES },
    ],
    message: (v) => \`Assigned to \${v[0].value} · \${v[1].value} priority\`,
  },
  {
    id: "archive",
    label: "Archive issue",
    icon: <ArchiveIcon />,
    danger: true,
    slots: [],
    message: () => "Issue archived",
  },
]

export function IssueActions() {
  return (
    <CommandPalette
      commands={COMMANDS}
      onApply={(clauses) => console.log("apply", clauses)}
    />
  )
}
`;

/** Newest first: the home page prints them in this order. */
export const crafts: Craft[] = [
  {
    slug: "command-palette",
    publishedAt: "2026-08-15",
    title: "Command Palette with Argument Chips",
    description: {
      PT: "Comandos que recebem argumentos ali mesmo, viram chips, e uma lista que se mede antes de mudar de altura.",
      EN: "Commands that take their arguments inline, collapse into chips, and a list that measures itself before changing height.",
      ES: "Comandos que reciben sus argumentos en línea, se vuelven chips, y una lista que se mide antes de cambiar de altura.",
    },
    seoDescription: {
      PT: "Command palette em React com argumentos em chips, busca por subsequência pontuada e uma única parada de tabulação do começo ao fim.",
      EN: "A React command palette with inline argument chips, scored subsequence matching, and exactly one tab stop from start to finish.",
      ES: "Command palette en React con argumentos en chips, búsqueda por subsecuencia puntuada y una sola parada de tabulación.",
    },
    files: [
      {
        name: "CommandPalette.tsx",
        path: "components/crafts/command-palette.tsx",
        lang: "tsx",
      },
      { name: "Usage.tsx", code: PALETTE_USAGE, lang: "tsx" },
    ],
  },
  {
    slug: "loading-state",
    publishedAt: "2026-08-15",
    title: "Loading State",
    description: {
      PT: "Loader em grade de pixels, com brilho passando pelo texto e o tempo decorrido.",
      EN: "A pixel-grid loader, with a shimmer across the label and the time elapsed.",
      ES: "Loader en cuadrícula de píxeles, con brillo sobre el texto y el tiempo transcurrido.",
    },
    seoDescription: {
      PT: "Loader em React para espera longa: grade de 3x3 com frente de onda, brilho no rótulo e cronômetro que não atrasa em aba ocupada.",
      EN: "A React loader for long waits: a 3x3 grid with a travelling wavefront, a shimmering label, and a timer that cannot drift.",
      ES: "Loader en React para esperas largas: cuadrícula 3x3 con frente de onda, brillo en la etiqueta y cronómetro que no se atrasa.",
    },
    files: [
      {
        name: "LoadingState.tsx",
        path: "components/crafts/loading-state.tsx",
        lang: "tsx",
      },
      { name: "Usage.tsx", code: LOADING_USAGE, lang: "tsx" },
    ],
  },
  {
    slug: "cassette-audio-player",
    publishedAt: "2026-08-15",
    title: "Cassette Audio Player",
    description: {
      PT: "Um player de áudio construído dentro de uma fita cassete.",
      EN: "An audio player built into a compact cassette.",
      ES: "Un reproductor de audio construido dentro de un casete.",
    },
    seoDescription: {
      PT: "Player de áudio em React com carretéis que giram junto com a fita, rebobinar de verdade e a bobina trocando de diâmetro conforme toca.",
      EN: "A React audio player with reels that turn with the tape, a rewind that winds back, and spools that trade diameter as it plays.",
      ES: "Reproductor de audio en React con carretes que giran con la cinta, rebobinado real y bobinas que cambian de diámetro al sonar.",
    },
    files: [
      {
        name: "CassettePlayer.tsx",
        path: "components/crafts/cassette-player.tsx",
        lang: "tsx",
      },
      { name: "Usage.tsx", code: CASSETTE_USAGE, lang: "tsx" },
    ],
    credit: {
      PT: "Áudio da NASA, domínio público: Apollo 11, 20 de julho de 1969.",
      EN: "Audio courtesy of NASA, public domain: Apollo 11, 20 July 1969.",
      ES: "Audio de la NASA, dominio público: Apolo 11, 20 de julio de 1969.",
    },
  },
];

export const craftBySlug = new Map(crafts.map((craft) => [craft.slug, craft]));

export function getCraft(slug: string): Craft {
  const craft = craftBySlug.get(slug);
  if (!craft) throw new Error(`No craft named "${slug}"`);
  return craft;
}
