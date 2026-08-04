import type { Meta, StoryObj } from "@storybook/nextjs"
import { ClosingCta } from "@sb-components/nivo/blocks/landing/ClosingCta/ClosingCta"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ClosingCta` — the landing's final beat: repeats the hero's own
 * primary/secondary CTA pair so the scrolled reader never has to scroll back
 * up for the one north-star action. `eyebrow` is the one optional prop, so
 * its presence is the leaf.
 */
const meta: Meta<typeof ClosingCta> = {
    title: "Nivo/Blocks/Landing/ClosingCta/ClosingCta",
    component: ClosingCta,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ClosingCta>

const NOOP = () => {}

const TITLE = "Start with a platform product — or an audit of your exact bottleneck"
const DESCRIPTION = "You're not short on tools. What you need is a system that never lets a lead slip through."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SectionHeading: { tier: "block", role: "the centered eyebrow / title / intro header", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    Cluster: { tier: "frame", role: "the primary + secondary CTA row, centered and wrapping" },
    Button: { tier: "atom", role: "the repeated hero primary and the audit secondary" },
}

/** LEAF — `eyebrow`: full coverage of both members of the optional-string union. */
export const Eyebrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ClosingCta"
                tier="block"
                leaf="eyebrow"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. Both CTAs fire callbacks the caller owns — this block invents no destination of its own, it only repeats the hero's own primary/secondary pair so the page's one north-star action stays reachable at the close. The one prop this beat leaves optional is `eyebrow`, so its presence is the leaf."
                states={[
                    {
                        name: "eyebrow set",
                        why: "The default marketing placement: a small kicker sits above the headline, matching the other centered beats on the page.",
                        code: `<ClosingCta
    eyebrow="Ready whenever you are"
    title="Start with a platform product — or an audit of your exact bottleneck"
    description="You're not short on tools. What you need is a system that never lets a lead slip through."
    primaryCta={{ label: "Choose a plan to start", onPress: openPricing }}
    secondaryCta={{ label: "Take the Lead-Leakage Audit", onPress: openAudit }}
/>`,
                        render: (
                            <ClosingCta
                                eyebrow="Ready whenever you are"
                                title={TITLE}
                                description={DESCRIPTION}
                                primaryCta={{ label: "Choose a plan to start", onPress: NOOP }}
                                secondaryCta={{ label: "Take the Lead-Leakage Audit", onPress: NOOP }}
                            />
                        ),
                    },
                    {
                        name: "eyebrow omitted",
                        why: "A bare variant with no kicker line — the headline sits alone above the description and CTA row.",
                        code: `<ClosingCta title="Start with a platform product — or an audit of your exact bottleneck" description={description} primaryCta={primaryCta} secondaryCta={secondaryCta} />`,
                        render: (
                            <ClosingCta
                                title={TITLE}
                                description={DESCRIPTION}
                                primaryCta={{ label: "Choose a plan to start", onPress: NOOP }}
                                secondaryCta={{ label: "Take the Lead-Leakage Audit", onPress: NOOP }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
