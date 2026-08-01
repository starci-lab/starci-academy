import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SnippetIcon`: the system's ONE single-click copy affordance.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the atom-tier rule). Going through every prop
 * after the first fix pass: `copyString` is REQUIRED but produces NO visual
 * difference — every value renders the same copy glyph, only the content written
 * to the clipboard changes, so it gets no leaf of its own. `className` is the
 * class back door, no leaf either. What's left is exactly ONE prop with a shape:
 *
 * - `isCopied` — pins the ✓ glyph from the outside (§12f). BEFORE this fix, the ✓
 *   frame was only produced by INTERNAL `useState`/`setTimeout`, so no static story
 *   could pin it — the old version had to fake it with `play()` simulating a click
 *   (see the old file; don't port that approach).
 *
 * So the leaf set is: `Default` (bare, idle) + `Copied` (prop `isCopied`, two states
 * side by side). The atom now has `showAnatomy`/`anatPart` so both leaves can carry
 * a badge — this used to be the ONE atom in the system without anatomy.
 *
 * 2026-07-27: migrated every leaf to the `states[]` API (§8/§4a). The `Copied` leaf
 * used to stack TWO examples (idle + pinned) side by side in one frame; now split
 * into two states.
 */

/** Heading shown at the top of the autodocs page. UI copy is written in ENGLISH. */
const SNIPPET_ICON_DOC = `
## One glyph, one job

A single leading affordance that sits next to the value it copies — a CLI
command, an API key, a short URL. Click it and the value is written to the
clipboard; the glyph swaps to a checkmark for a moment to confirm the write,
then returns to the copy icon on its own.

Place it inline with the text being copied, not inside a multi-line code
block — a block that long needs its own confirmation toast instead.

There is no size or tone axis here: every call site renders the exact same
shape, so the affordance stays recognizable wherever it shows up.

## Pinning the checkmark

The checkmark only ever appears for 350ms after a real click, which a static
page can't demonstrate on its own. Pass \`isCopied\` to pin either state from
the outside — leave it unset and the atom keeps managing it internally.
`

/**
 * `Icon` is the swapping glyph span — a plain element, not a fixed importable
 * component, so it links back to THIS atom's own `Copied` leaf/story (§13z internal
 * geometry, self-link) instead of going undeclared: that leaf is where the reader
 * actually sees both the copy and check frames explained side by side. The root
 * trigger gets no self-badge — it's the whole leaf being viewed, nothing to jump to.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Icon": {
        tier: "atom",
        role: "the swapping glyph — a copy icon, or a checkmark for 350ms after a click — see the Copied leaf for both frames",
        storyId: "atoms-display-snippeticon-snippeticon--copied",
    },
}

const meta: Meta<typeof SnippetIcon> = {
    title: "Atoms/Display/SnippetIcon/SnippetIcon",
    component: SnippetIcon,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: SNIPPET_ICON_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof SnippetIcon>

/** Bare leaf — the copy glyph at rest, `isCopied` not yet turned on. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SnippetIcon"
                tier="atom"
                leaf="Bare icon"
                annotate={ANNOTATE}
                reason="The one copy affordance in the system. It sits next to the value it copies and needs nothing else to work, no size, no tone, no icon choice."
                states={[
                    {
                        name: "copyString set, isCopied not set",
                        why: "A single copy glyph sits beside the command text, at rest, waiting for a click. copyString only changes what gets written to the clipboard, never the glyph itself, which is why the prop is required but earns no leaf of its own.",
                        code: "<SnippetIcon copyString=\"npm install @starciacademy/playground-agent\" />",
                        render: (
                            <div data-tier="fixture" className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                                <Typography type="body-sm" className="font-mono">
                                    npm install @starciacademy/playground-agent
                                </Typography>
                                <SnippetIcon
                                    copyString="npm install @starciacademy/playground-agent"
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `isCopied` — the ✓ glyph pinned from the outside, beside the idle copy glyph. */
export const Copied: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SnippetIcon"
                tier="atom"
                leaf="Prop `isCopied`"
                annotate={ANNOTATE}
                reason="A real click swaps the glyph to a checkmark for 350ms on its own, but a static page can never land on that exact millisecond, so isCopied pins either frame for anyone building or reviewing this state."
                states={[
                    {
                        name: "isCopied not set",
                        why: "The glyph shows the plain copy icon, unchanged from the Default leaf. Left unset, the atom keeps managing the checkmark swap itself through internal state, exactly as it does everywhere else it is used.",
                        code: "<SnippetIcon copyString=\"npm install pkg\" />",
                        render: (
                            <div data-tier="fixture" className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                                <Typography type="body-sm" className="font-mono">
                                    sk-live-51H8x2KJ9mQwErTyUiOp
                                </Typography>
                                <SnippetIcon
                                    copyString="sk-live-51H8x2KJ9mQwErTyUiOp"
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                    {
                        name: "isCopied = true",
                        why: "The glyph shows the checkmark instead of the copy icon, staying pinned to that frame regardless of whatever internal state the atom would otherwise be in. Pinning it this way is the only way a static page can display the confirmation frame that a real click only holds for 350ms.",
                        code: "<SnippetIcon copyString=\"npm install pkg\" isCopied />",
                        render: (
                            <div data-tier="fixture" className="flex max-w-md items-center justify-between gap-3 rounded-lg border border-default bg-muted px-3 py-2">
                                <Typography type="body-sm" className="font-mono">
                                    git clone https://github.com/StarCi-Academy/rag-from-scratch
                                </Typography>
                                <SnippetIcon
                                    copyString="git clone https://github.com/StarCi-Academy/rag-from-scratch"
                                    isCopied
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
