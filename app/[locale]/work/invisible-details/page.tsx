import { CodeBlock } from "@/components/code-block"
import { ArticleContent } from "./article-content"

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt-br' }, { locale: 'es' }]
}

export default function InvisibleDetailsPage() {
  return (
    <ArticleContent
      codeEasing={
        <CodeBlock
          lang="css"
          code={`:root {
  /* Strong ease-out for UI interactions */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  /* Strong ease-in-out for on-screen movement */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);

  /* Icon crossfade curve */
  --ease-icon: cubic-bezier(0.2, 0, 0, 1);
}`}
        />
      }
      codeScalePress={
        <CodeBlock
          lang="css"
          code={`.button {
  transition: scale 150ms ease-out;
}

.button:active {
  scale: 0.96;
}`}
        />
      }
      codeIconSwap={
        <CodeBlock
          lang="css"
          code={`.icon-swap {
  display: grid;
  place-items: center;
}

.icon-swap > * {
  grid-area: 1 / 1;
  transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1),
              transform 300ms cubic-bezier(0.2, 0, 0, 1),
              filter 300ms cubic-bezier(0.2, 0, 0, 1);
}

.icon-visible {
  opacity: 1;
  transform: scale(1);
  filter: blur(0px);
}

.icon-hidden {
  opacity: 0;
  transform: scale(0.25);
  filter: blur(4px);
}`}
        />
      }
      codeShadow={
        <CodeBlock
          lang="css"
          code={`:root {
  --shadow-border:
    0px 0px 0px 1px rgba(0, 0, 0, 0.06),
    0px 1px 2px -1px rgba(0, 0, 0, 0.06),
    0px 2px 4px 0px rgba(0, 0, 0, 0.04);
}

/* Dark mode — single white ring */
.dark {
  --shadow-border: 0 0 0 1px rgba(255, 255, 255, 0.08);
}`}
        />
      }
      codeRadius={
        <CodeBlock
          lang="css"
          code={`/* outerRadius = innerRadius + padding */
.card {
  border-radius: 20px;
  padding: 8px;
}
.card-inner {
  border-radius: 12px; /* 20 - 8 = 12 ✓ */
}`}
        />
      }
      codeStagger={
        <CodeBlock
          lang="css"
          code={`.stagger-item {
  opacity: 0;
  transform: translateY(12px);
  filter: blur(4px);
  animation: fadeInUp 400ms ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 200ms; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}`}
        />
      }
      codePerformance={
        <CodeBlock
          lang="css"
          code={`/* Good — only animate what changes */
.card {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

/* Bad — transition everything */
.card {
  transition: all 200ms ease-out;
}`}
        />
      }
    />
  )
}
