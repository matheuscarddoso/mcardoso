/**
 * Schema.org payload as a plain script tag, rendered on the server so it lands
 * in the initial HTML. Crawlers read the served document — structured data
 * injected after hydration is invisible to most of them.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // A `</script>` sequence inside any string value would close the tag
      // early. Escaping `<` is the standard defence and stays valid JSON.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
