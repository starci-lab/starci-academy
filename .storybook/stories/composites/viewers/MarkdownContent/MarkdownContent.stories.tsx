import type { Meta, StoryObj } from "@storybook/nextjs"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * VIEWER — `MarkdownContent`: paint an authored markdown document faithfully.
 *
 * ⭐ WHY A VIEWER (§4b). Every other composite KNOWS its shape before it renders
 * — a card has a label and rows, a header has a title and meta. This one CANNOT:
 * the shape is decided by the PAYLOAD. That is the whole membership test for the
 * `viewers` group.
 *
 * ⭐ SCOPE OF THIS PASS (teacher's call, 2026-07-29, in priority order): Shiki
 * syntax-highlighted fenced code · mermaid diagrams (SVG, click-to-zoom, caption
 * pairing) · `:::tab`/`:::code`/`:::preview` → Preview↔Code tabs · GFM tables →
 * real HeroUI `Table` · `::::accordion`/`:::panel` → the CORRECT HeroUI
 * `Accordion` (with `bg-surface rounded-3xl border border-default` chrome — the
 * previous port used the wrong, Disclosure-based `Accordion` atom) · `:::muted` +
 * `:::chip` + image captions + link routing + heading anchors. Still NOT ported:
 * `arcSections`, `plain` mode, the ` ```mdx ` live-render fence, the
 * ` ```layout ` fence — each is a viewer/runtime of its own.
 *
 * ⚠️ THE ONLY PLACE HAND-WRITTEN SPACING IS CORRECT. A viewer cannot reach for
 * frames: it never sees its children as nodes, only as whatever the parser hands
 * back. Same exemption §13z gives the atom tier, for the same reason — there is
 * no seam to own when the tree is not yours.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the two MEASURES are leaves, because the whole
 * rhythm changes. Which grammar a document happens to use is payload ⇒ states.
 */
const meta: Meta<typeof MarkdownContent> = {
    title: "Composites/Viewers/MarkdownContent",
    component: MarkdownContent,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MarkdownContent>

const PROSE = `## Why the image keeps growing

Every instruction in \`Dockerfile\` spawns a **layer**, and layers *accumulate* — deleting a
file in a later layer doesn't reclaim the space it took up in an earlier one.

- \`COPY . .\` before \`npm ci\` breaks the cache every time the code changes
- the build toolchain lingers inside the real runtime image
- a temp file removed in a later instruction still sits intact in the earlier layer

> Read the instruction order carefully before optimizing anything else.

### Further reading

See the [official docs](https://docs.docker.com/build/cache/) or go back to
[the previous lesson](/lessons/docker-basics).`

const CODE = `Reorder the instructions so the cache still holds (real Shiki syntax highlighting):

\`\`\`dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
\`\`\`

Dependencies only need reinstalling when \`package*.json\` itself changes.`

const MERMAID = `## The image rebuild flow

\`\`\`mermaid
flowchart LR
    A[Edit code] --> B{package.json changed?}
    B -- Yes --> C[Reinstall dependencies]
    B -- No --> D[Use the npm ci cache]
    C --> E[Rebuild everything]
    D --> E
\`\`\`
Figure 1: The cache only breaks when the dependency declaration changes.`

const TABLE = `| Approach | Image | Rebuild time |
|---|---|---|
| COPY . . before npm ci | 1.2 GB | 4 min |
| Separate dependency layer | 1.2 GB | 40 sec |
| Multi-stage | 40 MB | 45 sec |`

const ACCORDION = `::::accordion

:::panel{title="Why not use \`latest\`?"}
The \`latest\` tag points somewhere new after every push, so two deploys of the same commit
can end up running two different images.
:::

:::panel{title="When should you squash layers?"}
Almost never. Squashing breaks the cache and reclaims very little space in return.
:::

::::`

const MUTED_AND_CHIP = `:::muted
Input
:::

One \`Dockerfile\` plus one \`.dockerignore\`.

:::chip
Docker
BuildKit
Cache
:::`

const TABS = `::::tab

:::preview
\`\`\`mdx
<Chip color="success">Build complete</Chip>
\`\`\`
:::

:::code
\`\`\`tsx
export const BuildBadge = () => <Chip color="success">Build complete</Chip>
\`\`\`
:::

::::`

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "MarkdownContent": { tier: "composite", role: "the document itself: the viewer repeats whatever the payload contains and owns only the rhythm it is repeated at", storyId: "composites-viewers-markdowncontent--reading" },
    "SnippetIcon": { tier: "atom", role: "the copy control on a fenced code block, owning its own copied confirmation", storyId: "atoms-display-snippeticon-snippeticon--default" },
    "Chip": { tier: "atom", role: "one keyword pill inside a `:::chip` directive row, soft/neutral tone", storyId: "atoms-chips-chip-chip--default" },
    "Skeleton": { tier: "heroui", role: "the 2-line shimmer mirror standing in for the document while `isSkeleton`" },
}

/** LEAF — `reading`: the lesson body, bigger type and a generous rhythm. */
export const Reading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MarkdownContent"
                tier="composite"
                leaf="Measure `reading`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "prose document",
                        why: "Headings, paragraphs, a list, a quote, emphasis, inline code and links — the grammar most lessons are written in. Every `h2`/`h3` carries a slug `id` + a hover `#` deep-link (the TOC hook); the internal `/lessons/...` link stays in-tab while the external docs link opens a new tab — both routed through the same `Typography` atom, distinguished only by `target`/`rel`.",
                        code: "<MarkdownContent source={lessonBody} />",
                        render: <MarkdownContent source={PROSE} />,
                    },
                    {
                        name: "fenced code block",
                        why: "A fenced block is highlighted for real by Shiki (`material-theme-lighter`/`-darker`, following the Storybook toolbar theme), lazily — it only lights up once the block nears the viewport. The language is named in the corner next to a real copy control (the `SnippetIcon` atom).",
                        code: "<MarkdownContent source={lessonWithCode} />",
                        render: <MarkdownContent source={CODE} />,
                    },
                    {
                        name: "mermaid diagram",
                        why: "A ` ```mermaid ` fence renders to a real SVG (cached per theme+source), click-to-zoom into a full-screen Modal, with the authored \"Figure N: …\" paragraph lifted into a real `<figcaption>` instead of being shown twice.",
                        code: "<MarkdownContent source={lessonWithDiagram} />",
                        render: <MarkdownContent source={MERMAID} />,
                    },
                    {
                        name: "table",
                        why: "A GFM table renders through the real HeroUI `Table` compound (header/body/cell, `isRowHeader` on the first column) rather than a raw `<table>` — so it gets the same a11y and visual treatment as every other table in the app. It still scrolls INSIDE its own box rather than pushing the article sideways.",
                        code: "<MarkdownContent source={comparisonTable} />",
                        render: <MarkdownContent source={TABLE} />,
                    },
                    {
                        name: "accordion directive",
                        why: "The `::::accordion` / `:::panel` syntax already in written lessons becomes the CORRECT HeroUI `Accordion` compound (`Item`/`Heading`/`Trigger`/`Indicator`/`Panel`/`Body`) with the `bg-surface rounded-3xl border border-default` card chrome and the re-pointed `--separator` hairline — not the Disclosure-based `Accordion` atom this composite used to route through, which is a different primitive with nowhere to hang that chrome.",
                        code: "<MarkdownContent source={lessonWithAccordion} />",
                        render: <MarkdownContent source={ACCORDION} />,
                    },
                    {
                        name: "muted label + chip row",
                        why: "`:::muted` renders a small muted eyebrow label (the \"Input\"/\"Output\" idiom lessons already use); `:::chip` turns a block of keyword lines into a wrapped row of real `Chip` atoms, one pill per line.",
                        code: "<MarkdownContent source={inputLabelWithChips} />",
                        render: <MarkdownContent source={MUTED_AND_CHIP} />,
                    },
                    {
                        name: "tab/code/preview directive",
                        why: "`::::tab` wrapping a `:::preview`/`:::code` pair becomes [ Preview | Code ] tabs — used for a real component demo alongside its full source, where a single ` ```mdx ` fence can't show both at once. Preview is selected first.",
                        code: "<MarkdownContent source={lessonWithTabs} />",
                        render: <MarkdownContent source={TABS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `compact`: the document is a passenger inside another surface. */
export const Compact: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MarkdownContent"
                tier="composite"
                leaf="Measure `compact`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "measure = compact",
                        why: "Every step of the rhythm tightens for markdown quoted inside another surface, such as a chat answer or a card. The document is a passenger there rather than the page, and reading-page spacing would make the surface around it look broken. Code, tables, mermaid and directives all render identically at this measure, just tighter.",
                        code: "<MarkdownContent source={answer} measure=\"compact\" />",
                        render: <MarkdownContent source={PROSE} measure="compact" />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; a 2-line shimmer mirror stands in for the document (§12c, added 2026-07-29 so callers stop faking it with an unrelated atom). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="MarkdownContent"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The composite owns its own loading mirror — before this, the one caller that needed it (MockInterviewScorecard's follow-up question) swapped in a bare `Typography isSkeleton` instead, which drew a different shape than the real document ever does.",
                        code: "<MarkdownContent source={followUp} isSkeleton />",
                        render: <MarkdownContent source="" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
