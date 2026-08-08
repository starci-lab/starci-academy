/**
 * Sentence-tier host ownership.
 *
 * Blocks, pages, layouts, and overlays compose vocabulary. They must not render
 * structural host elements directly — the vocabulary owner renders the host.
 *
 * Contract: `.claude/fe/contracts/sentence-hosts.md`
 */

/** Structural hosts forbidden at sentence tier (contract list — not span/p/lists). */
const FORBIDDEN_HOSTS = new Set([
  "div",
  "footer",
  "aside",
  "section",
  "main",
  "header",
  "nav",
])

const SENTENCE_DIRS = "(?:blocks|pages|layouts|overlays)"

/**
 * True when the file lives under a sentence-tier folder in src or Storybook
 * product trees (starci / nivo / nivoexpert / mia-mia / bare components).
 */
export const isSentenceTierFile = (filename) => {
  const file = String(filename || "").replace(/\\/g, "/")
  if (new RegExp(`/src/components/${SENTENCE_DIRS}/`).test(file)) return true
  if (new RegExp(`/\\.storybook/components/${SENTENCE_DIRS}/`).test(file)) return true
  if (new RegExp(`/\\.storybook/components/[^/]+/${SENTENCE_DIRS}/`).test(file)) return true
  return false
}

/** Simple JSX intrinsic name, or null for members / namespaced tags. */
const jsxHostName = (openingElement) => {
  const name = openingElement?.name
  if (!name || name.type !== "JSXIdentifier") return null
  const tag = name.name
  // Intrinsic hosts are lowercase; custom components are PascalCase.
  if (tag !== tag.toLowerCase()) return null
  return tag
}

/** ESLint rule: sentence tiers must not render raw structural hosts. */
export const noHostElementAtSentenceTier = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Blocks, pages, layouts, and overlays must not render raw structural host elements; compose a typed vocabulary owner instead.",
    },
    schema: [],
    messages: {
      host:
        "Sentence-tier file must not render raw `<{{tag}}>`. Compose a typed vocabulary owner that owns this landmark, layout, or chrome (see `.claude/fe/contracts/sentence-hosts.md`).",
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename()
    if (!isSentenceTierFile(filename)) return {}

    return {
      JSXOpeningElement(node) {
        const tag = jsxHostName(node)
        if (!tag || !FORBIDDEN_HOSTS.has(tag)) return
        context.report({ node, messageId: "host", data: { tag } })
      },
    }
  },
}
