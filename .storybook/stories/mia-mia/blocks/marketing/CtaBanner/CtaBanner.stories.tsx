import type { Meta, StoryObj } from "@storybook/nextjs"
import { CtaBanner } from "@sb-components/mia-mia/blocks/marketing/CtaBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CtaBanner`: the closing call-to-action, a dark rounded slab with a pink
 * offset shadow, a headline, a reassurance line, and one `ChunkyButton`.
 *
 * One prop = one leaf: `title` · `description` · `ctaLabel` each get their own leaf.
 * `ctaHref` is deliberately left without a leaf — see the note beside its section
 * below, it changes only the anchor's destination, never anything the eye can see.
 *
 * Use it once, near the foot of the page, to repeat the primary action after the
 * pitch. The dark fill is the last, loudest beat, so it does not double as a
 * mid-page section.
 */
const meta: Meta<typeof CtaBanner> = {
    title: "MiaMia/CtaBanner",
    component: CtaBanner,
    tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof CtaBanner>

/**
 * `CtaBanner` renders one nested atom: the `ChunkyButton` CTA. Title and
 * description are plain `h2`/`p` elements the block owns directly, so they get
 * no entry of their own.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "ChunkyButton": { tier: "atom", role: "the CTA link the banner ends on, its shadow flipped to cream so it still reads against the dark ink fill", storyId: "miamia-chunkybutton--default" },
}

const BASE_DESCRIPTION = "Free, no card required. Mia is ready to coach you from the first question."
const BASE_CTA_LABEL = "Start learning free"

/** Leaf for prop `title` — the closing headline, bold and centered with `text-balance`. */
export const Title: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CtaBanner"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `title`"
                reason="The headline is the one line the banner exists to repeat, so it carries the heaviest weight in the slab. `text-balance` keeps a two-line wrap even rather than leaving a lonely short word on its own line."
                states={[
                    {
                        name: "title = \"Start your first exam today\" (typical)",
                        why: "A short, direct headline sits on one line at most viewport widths, the shape most pages actually ship.",
                        code: `<CtaBanner
    title="Start your first exam today"
    description="${BASE_DESCRIPTION}"
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Start your first exam today"
                                description={BASE_DESCRIPTION}
                                ctaLabel={BASE_CTA_LABEL}
                                ctaHref="#"
                            />
                        ),
                    },
                    {
                        name: "title = long sentence",
                        why: "A longer headline wraps across two lines and `text-balance` splits it evenly instead of leaving a short orphan word dangling on the second line.",
                        code: `<CtaBanner
    title="Stop guessing your score and start training with the exact exam Mia grades in real time"
    description="${BASE_DESCRIPTION}"
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Stop guessing your score and start training with the exact exam Mia grades in real time"
                                description={BASE_DESCRIPTION}
                                ctaLabel={BASE_CTA_LABEL}
                                ctaHref="#"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `description` — the reassurance line, capped at `max-w-[46ch]`. */
export const Description: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CtaBanner"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `description`"
                reason="The reassurance line answers the hesitation right under the headline — no card, no risk — so it stays short and sits at `white/80` rather than competing with the headline's full-white weight."
                states={[
                    {
                        name: "description = \"Free, no card required…\" (typical)",
                        why: "One short sentence sits comfortably under the headline within the 46-character cap, the length most banners actually carry.",
                        code: `<CtaBanner
    title="Start your first exam today"
    description="Free, no card required. Mia is ready to coach you from the first question."
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Start your first exam today"
                                description="Free, no card required. Mia is ready to coach you from the first question."
                                ctaLabel={BASE_CTA_LABEL}
                                ctaHref="#"
                            />
                        ),
                    },
                    {
                        name: "description = long sentence",
                        why: "At the `max-w-[46ch]` cap a longer reassurance line wraps onto a second line rather than stretching the slab wider, keeping the banner's width stable regardless of copy length.",
                        code: `<CtaBanner
    title="Start your first exam today"
    description="No credit card, no trial limit, and no locked chapters — every mock exam and every vocabulary game unlocks the moment you sign up."
    ctaLabel="${BASE_CTA_LABEL}"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Start your first exam today"
                                description="No credit card, no trial limit, and no locked chapters — every mock exam and every vocabulary game unlocks the moment you sign up."
                                ctaLabel={BASE_CTA_LABEL}
                                ctaHref="#"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `ctaLabel` — the label passed straight through to the `ChunkyButton`. */
export const CtaLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CtaBanner"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `ctaLabel`"
                reason="The label is the one word or short phrase the reader must act on, so it is the only piece of copy in the slab that sits inside a pressable shape rather than plain text."
                states={[
                    {
                        name: "ctaLabel = \"Start learning free\" (typical)",
                        why: "A short imperative label keeps the chunky button's pill compact, matching the width every other CTA on the marketing surface takes.",
                        code: `<CtaBanner
    title="Start your first exam today"
    description="${BASE_DESCRIPTION}"
    ctaLabel="Start learning free"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Start your first exam today"
                                description={BASE_DESCRIPTION}
                                ctaLabel="Start learning free"
                                ctaHref="#"
                            />
                        ),
                    },
                    {
                        name: "ctaLabel = long phrase",
                        why: "A longer label grows the button along with it rather than truncating or breaking the layout, since the button sizes to its content.",
                        code: `<CtaBanner
    title="Start your first exam today"
    description="${BASE_DESCRIPTION}"
    ctaLabel="Create your free account and start today"
    ctaHref="#"
/>`,
                        render: (
                            <CtaBanner
                                title="Start your first exam today"
                                description={BASE_DESCRIPTION}
                                ctaLabel="Create your free account and start today"
                                ctaHref="#"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
