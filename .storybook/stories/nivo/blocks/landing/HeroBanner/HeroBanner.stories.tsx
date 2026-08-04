import type { Meta, StoryObj } from "@storybook/nextjs"
import { HeroBanner } from "@sb-components/nivo/blocks/landing/HeroBanner/HeroBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HeroBanner` — the full-fold landing hero. The one north-star primary always
 * shows; the secondary CTA is optional, so its presence is the one leaf.
 * Grounded in the streamlined two-product platform.
 */
const meta: Meta<typeof HeroBanner> = {
    title: "Nivo/Blocks/Landing/HeroBanner/HeroBanner",
    component: HeroBanner,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HeroBanner>

const NOOP = () => {}

const COPY = {
    eyebrow: "The nivo platform",
    headline: "Launch an AI product you actually own",
    description: "Two ready-to-run products — an AI Academy site of your own and a multi-agent AI team for your business — live in days, not quarters.",
    primaryLabel: "Browse the catalog",
    secondaryLabel: "See the products",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Container: { tier: "frame", role: "the centered, width-capped hero column" },
    StackV: { tier: "frame", role: "the eyebrow / headline / description / CTA rhythm" },
    Cluster: { tier: "frame", role: "the CTA row (primary beside the optional secondary)" },
    Typography: { tier: "atom", role: "the eyebrow, headline, and description" },
    Button: { tier: "atom", role: "the primary CTA and the optional secondary CTA" },
}

/** LEAF — the hero has one shape; the optional secondary CTA is the one thing that varies. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HeroBanner"
                tier="block"
                leaf="Secondary CTA"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. A landing keeps its single north-star primary in the hero, so the primary always renders; the secondary is a convenience jump to the product beats and is optional. Passing `secondaryLabel` (with `onSecondary`) is the one axis that changes the shape — with it the CTA row holds two buttons, without it just the primary."
                states={[
                    {
                        name: "secondaryLabel set",
                        why: "The default marketing hero: the primary drives into the catalog and a quieter secondary offers to scroll down to the two product beats first.",
                        code: `<HeroBanner
    eyebrow={copy.eyebrow}
    headline={copy.headline}
    description={copy.description}
    primaryLabel={copy.primaryLabel}
    onPrimary={browse}
    secondaryLabel={copy.secondaryLabel}
    onSecondary={scrollToBeats}
/>`,
                        render: (
                            <HeroBanner
                                eyebrow={COPY.eyebrow}
                                headline={COPY.headline}
                                description={COPY.description}
                                primaryLabel={COPY.primaryLabel}
                                onPrimary={NOOP}
                                secondaryLabel={COPY.secondaryLabel}
                                onSecondary={NOOP}
                            />
                        ),
                    },
                    {
                        name: "secondaryLabel = undefined",
                        why: "A focused variant with nothing to compete with the primary — the CTA row collapses to the single north-star action.",
                        code: "<HeroBanner {...copy} primaryLabel={copy.primaryLabel} onPrimary={browse} />",
                        render: (
                            <HeroBanner
                                eyebrow={COPY.eyebrow}
                                headline={COPY.headline}
                                description={COPY.description}
                                primaryLabel={COPY.primaryLabel}
                                onPrimary={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
