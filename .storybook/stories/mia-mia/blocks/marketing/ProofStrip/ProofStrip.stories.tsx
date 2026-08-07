import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProofStrip } from "@sb-components/mia-mia/blocks/marketing/ProofStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ProofStrip`: the full-bleed pink proof band, a row of value-over-label
 * cells vertically ruled from `md`. It sits directly under the hero to back the
 * pitch with a few hard figures.
 *
 * `items` is the block's only prop, so it is the block's only leaf. There is no
 * finite value set to enumerate for an array — instead the leaf covers the counts
 * that change the grid's own behaviour: one cell (no divider), an even two-up
 * split, and the four-up default the block actually ships with.
 *
 * Four cells reads best (two-up on mobile). Not for long feature copy — each cell
 * is a number and a two-word label.
 */
const meta: Meta<typeof ProofStrip> = {
    title: "MiaMia/ProofStrip",
    component: ProofStrip,
    tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof ProofStrip>

/**
 * `ProofStrip` renders no nested atoms or composites — every cell is a plain `div`
 * the block owns directly, so there is nothing to name here.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Leaf for prop `items` — the proof cells; count drives both the grid columns and the dividers. */
export const Items: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ProofStrip"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="Each cell pairs one headline figure with a short label; the divider between cells is drawn for every item except the last, so the rule count always tracks the array length rather than a fixed layout."
                states={[
                    {
                        name: "items.length = 1",
                        why: "A single cell renders with no vertical rule at all, since the divider only appears between one cell and the next and there is no next cell here.",
                        code: `<ProofStrip
    items={[
        { key: "exams", value: "39", label: "real national exams" },
    ]}
/>`,
                        render: (
                            <ProofStrip
                                items={[
                                    { key: "exams", value: "39", label: "real national exams" },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "items.length = 2",
                        why: "Two cells fill the two-up mobile grid exactly and carry one rule between them from `md` up, the smallest count where the divider rule actually shows.",
                        code: `<ProofStrip
    items={[
        { key: "exams", value: "39", label: "real national exams" },
        { key: "games", value: "4", label: "vocab games" },
    ]}
/>`,
                        render: (
                            <ProofStrip
                                items={[
                                    { key: "exams", value: "39", label: "real national exams" },
                                    { key: "games", value: "4", label: "vocab games" },
                                ]}
                            />
                        ),
                    },
                    {
                        name: "items.length = 4 (default)",
                        why: "Four cells fill the four-up grid from `md` and the two-up mobile grid two rows deep — the shape the block actually ships with, and the one the `usage` note above recommends.",
                        code: `<ProofStrip
    items={[
        { key: "exams", value: "39", label: "real national exams" },
        { key: "games", value: "4", label: "vocab games" },
        { key: "tutor", value: "Mia", label: "AI teaching assistant" },
        { key: "live", value: "Live", label: "virtual exam room" },
    ]}
/>`,
                        render: (
                            <ProofStrip
                                items={[
                                    { key: "exams", value: "39", label: "real national exams" },
                                    { key: "games", value: "4", label: "vocab games" },
                                    { key: "tutor", value: "Mia", label: "AI teaching assistant" },
                                    { key: "live", value: "Live", label: "virtual exam room" },
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
