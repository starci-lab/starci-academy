import type { Meta, StoryObj } from "@storybook/nextjs"
import { AuthorByline } from "@sb-components/composites/lists/AuthorByline/AuthorByline"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AuthorByline` — name + optional verified/pinned glyphs + a relative timestamp, as one
 * inline row; a concrete implementation of `IdentityContentRow`'s `byline` slot. Leaves:
 * `verified`, `pinned` (each its own on/off shape). The verified/pinned glyphs render only
 * outside `isSkeleton` (no icon-shaped shimmer atom yet); the `·` separator is fixed chrome.
 */

const AUTHOR_BYLINE_DOC = `
## Composition

An AuthorByline is a name, up to two status glyphs right after it, a \`·\`, and a
relative timestamp — one inline row, no avatar. It is the "status+text" line an
\`IdentityContentRow\` mounts as its \`byline\` slot, or that a comment/post/thread
row uses on its own when there is no avatar in play.

## Verified and pinned

Both are plain booleans, not icon props — the row owns which fixed glyph each
one maps to (a filled seal-check for \`verified\`, a filled push-pin for
\`pinned\`), the same way a pass/fail glyph is owned by the row that shows it,
not chosen by the caller. Either, both, or neither can be on at once.

## Loading

Pass \`isSkeleton\` and the name/timestamp bars shimmer through their own
\`Typography\` atom. The verified/pinned glyphs do not have a shimmer shape yet,
so they simply do not render while loading — there is nothing to guess at
their size from. The \`·\` separator is not a value, so it stays on screen in
both states.
`

const meta: Meta<typeof AuthorByline> = {
    title: "Composites/Lists/AuthorByline/AuthorByline",
    component: AuthorByline,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: AUTHOR_BYLINE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof AuthorByline>

/**
 * Shared DOM annotation table for every leaf.
 *
 * The verified/pinned glyphs are bare `@phosphor-icons/react` SVGs (no house
 * atom wraps a single inline glyph like this yet — the same gap
 * `InlineIconLabel`'s leading icon documents), so — like `UserCell`'s
 * `Trailing` slot — they stay OUT of `annotate`: unbadged, real DOM, no story
 * of their own to jump to.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        role: "the name, the `·` separator, and the timestamp — three separate Typography instances",
        tier: "atom",
        storyId: "atoms-text-typography-typography--overview",
    },
}

/** BARE leaf — neither glyph on: name, `·`, timestamp. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuthorByline"
                tier="composite"
                leaf="Bare row"
                reason="The plain byline every list row starts from — a name and a relative time, nothing else. Every other leaf on this page differs from this one by exactly one prop."
                annotate={ANNOTATE}
                states={[
                    {
                        name: "verified = false, pinned = false",
                        why: "Only the name, the `·`, and the timestamp render — no glyph mounts between them because neither flag is on.",
                        code: "<AuthorByline name=\"Priya Shah\" timestamp=\"3 hours ago\" />",
                        render: <AuthorByline name="Priya Shah" timestamp="3 hours ago" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `verified` — a filled seal-check glyph right after the name. */
export const Verified: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuthorByline"
                tier="composite"
                leaf="Prop `verified`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "verified = false (default)",
                        why: "No glyph mounts between the name and the separator — the row reads as a plain author line.",
                        code: "<AuthorByline name=\"Marcus Reed\" timestamp=\"1 day ago\" />",
                        render: <AuthorByline name="Marcus Reed" timestamp="1 day ago" />,
                    },
                    {
                        name: "verified = true",
                        why: "A filled accent seal-check glyph mounts right after the name, before the separator — a fixed glyph the row owns, not one the caller passes in.",
                        code: "<AuthorByline name=\"Marcus Reed\" timestamp=\"1 day ago\" verified />",
                        render: <AuthorByline name="Marcus Reed" timestamp="1 day ago" verified />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `pinned` — a filled push-pin glyph after the name (and after `verified`, if both are set). */
export const Pinned: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuthorByline"
                tier="composite"
                leaf="Prop `pinned`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "pinned = false (default)",
                        why: "No pin glyph mounts — the row is a plain author line.",
                        code: "<AuthorByline name=\"Natalie Cross\" timestamp=\"12 minutes ago\" />",
                        render: <AuthorByline name="Natalie Cross" timestamp="12 minutes ago" />,
                    },
                    {
                        name: "pinned = true",
                        why: "A filled accent push-pin glyph mounts after the name. Combined with `verified` (both true), both glyphs sit side by side in prop order — seal-check first, then pin.",
                        code: "<AuthorByline name=\"Natalie Cross\" timestamp=\"12 minutes ago\" verified pinned />",
                        render: <AuthorByline name="Natalie Cross" timestamp="12 minutes ago" verified pinned />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c). The verified/pinned
 * glyphs and the name/timestamp bars are compared side by side so the ATOM
 * GAP (no icon shimmer shape) is visible: passing `verified`/`pinned` during
 * `isSkeleton` renders no glyph, only the two text bars shimmer.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AuthorByline"
                tier="composite"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The real row: name, both glyphs, `·`, timestamp — the shape `isSkeleton` mirrors.",
                        code: "<AuthorByline name=\"Daniel Ortiz\" timestamp=\"an hour ago\" verified pinned />",
                        render: <AuthorByline name="Daniel Ortiz" timestamp="an hour ago" verified pinned />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The name and timestamp bars shimmer through `Typography isSkeleton`, sized to that atom's own type scale. Even with `verified`/`pinned` passed, no glyph mounts — there is no icon-shaped shimmer to draw it as (an ATOM GAP), so the composite only shimmers the two parts an atom already knows how to. The `·` separator stays on screen: it is fixed chrome, not a value in flight.",
                        code: "<AuthorByline name=\"Daniel Ortiz\" timestamp=\"an hour ago\" verified pinned isSkeleton />",
                        render: <AuthorByline name="Daniel Ortiz" timestamp="an hour ago" verified pinned isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
