import type { Meta, StoryObj } from "@storybook/nextjs"
import { OMark } from "@sb-components/atoms/display/OMark/OMark"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `OMark`: nivo's Operating-Loop brand mark — a near-closed ring (a
 * muted Slate base arc + a Core Crimson active arc) plus one Signal Coral AI
 * node. Inline SVG, fixed brand colours, transparent background.
 *
 * Its only prop is `size` (plus `classNames`, which produces no leaf of its
 * own) — so the atom has no leaf other than `Default`, no union to enumerate.
 * The side-by-side tiles (both real hosts + a light-surface check) are
 * `states[]` entries of that one leaf, not separate leaves — the same shape
 * `Logo`'s own story takes.
 */

/** Copy shown at the top of the autodocs page. UI text is written in ENGLISH. */
const OMARK_DOC = `
## One mark, fixed colours

The mark draws three fixed hexes from the Visual Identity Brief — Slate Gray
\`#64748B\` (base ring), Core Crimson \`#E11D48\` (active ring), Signal Coral
\`#FB7185\` (AI node) — on a transparent background, so it reads on a dark
surface or a light one without a variant prop, the same reasoning \`Logo\` uses
for its own single fixed pink.

## Sizing is host-driven

\`size\` picks the root's square dimension: \`"inline"\` (\`size-6\`) for the
navbar/footer lockup beside the wordmark, \`"large"\` (\`size-24\`) standing
alone as the hero's loop visual. There is no raw-height escape hatch — a third
host gets a new named value here, not a class threaded through \`classNames\`.
`

const meta: Meta<typeof OMark> = {
    title: "Atoms/Display/OMark/OMark",
    component: OMark,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: OMARK_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof OMark>

/**
 * BARE leaf — `size` is the only prop with a visible effect (`classNames`
 * produces no shape of its own), so this is the whole atom's leaf set. The
 * three states below are the same fixed drawing at its two named hosts, plus
 * a light-surface check proving the mark needs no dark/light variant.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OMark"
                tier="atom"
                leaf="Prop `size`"
                reason="nivo's one brand mark — fixed colours, fixed drawing, no tone/variant union. `size` only picks which of the two real hosts (navbar/footer inline lockup vs. the hero's large standalone loop) the root's dimension matches."
                states={[
                    {
                        name: "size = \"inline\" (default) — navbar/footer lockup, on the dark shell",
                        why: "The compact form sits beside the wordmark in `MarketingNavbar` and `Footer`, both drawn on the dark premium shell (`MarketingLandingShell`). This is the real host most readers see the mark in.",
                        code: "<OMark size=\"inline\" />",
                        render: (
                            <div data-tier="fixture" className="dark flex items-center gap-3 rounded-lg bg-background p-6">
                                <OMark size="inline" />
                                <span className="text-sm text-foreground">niv<span className="text-accent">o</span></span>
                            </div>
                        ),
                    },
                    {
                        name: "size = \"large\" — the hero's standalone loop visual",
                        why: "Standing alone (no wordmark beside it), the mark reads as the operating-loop visual itself — the same fixed drawing, just at the hero's larger dimension.",
                        code: "<OMark size=\"large\" />",
                        render: (
                            <div data-tier="fixture" className="dark flex items-center justify-center rounded-lg bg-background p-10">
                                <OMark size="large" />
                            </div>
                        ),
                    },
                    {
                        name: "size = \"inline\", on a light surface",
                        why: "The exact same three fixed hexes render; only the surrounding background switches to light. This proves the mark needs no separate light-mode variant — unlike the shell it sits in, the mark itself is not theme-forced.",
                        code: `// on a light surface — same mark, no variant prop
<div className="bg-surface">
  <OMark size="inline" />
</div>`,
                        render: (
                            <div data-tier="fixture" className="flex items-center gap-3 rounded-lg border border-default bg-surface p-6">
                                <OMark size="inline" />
                                <span className="text-sm text-foreground">niv<span className="text-accent">o</span></span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
