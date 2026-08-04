import type { Meta, StoryObj } from "@storybook/nextjs"
import { StoryBeatCard } from "@sb-components/nivo/blocks/landing/StoryBeatCard/StoryBeatCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `StoryBeatCard` — one product beat: accent eyebrow, title, positioning line, a
 * plan-count chip, and a secondary CTA into the catalog. The card has one shape;
 * the two real products are its two data states. Grounded in `AI Academy` and
 * `nivo AI Agent`.
 */
const meta: Meta<typeof StoryBeatCard> = {
    title: "Nivo/Blocks/Landing/StoryBeatCard/StoryBeatCard",
    component: StoryBeatCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof StoryBeatCard>

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card the beat sits in" },
    StackV: { tier: "frame", role: "the eyebrow / title / description block and the card rhythm" },
    StackH: { tier: "frame", role: "the footer row (plan chip beside the CTA)" },
    Chip: { tier: "atom", role: "the plan-count chip" },
    Typography: { tier: "atom", role: "the eyebrow, title, and description" },
    Button: { tier: "atom", role: "the secondary see-plans CTA" },
}

/** LEAF — the beat has one shape; the two products are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StoryBeatCard"
                tier="block"
                leaf="Product beat"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`. Which product a beat pitches is DATA, so it is a state of the one shape, not a separate leaf. The CTA is deliberately secondary — a landing keeps its single primary in the hero — and the plan-count chip copy arrives already pluralized so the block never fabricates the count."
                states={[
                    {
                        name: "AI Academy",
                        why: "The first product beat: a template that spins up your own academy site, free to start and climbing through three plans.",
                        code: `<StoryBeatCard
    eyebrow="Site from template"
    title="AI Academy"
    description={academyPitch}
    unitCountLabel="3 plans"
    ctaLabel="See plans"
    onCtaPress={openAcademy}
/>`,
                        render: (
                            <StoryBeatCard
                                eyebrow="Site from template"
                                title="AI Academy"
                                description="Spin up your own academy site and classes from a template — tuition collection and an AI tutor built in."
                                unitCountLabel="3 plans"
                                ctaLabel="See plans"
                                onCtaPress={NOOP}
                            />
                        ),
                    },
                    {
                        name: "nivo AI Agent",
                        why: "The second product beat: a multi-agent AI team across chat channels, offered across two plans.",
                        code: "<StoryBeatCard eyebrow=\"AI Agent\" title=\"nivo AI Agent\" unitCountLabel=\"2 plans\" … />",
                        render: (
                            <StoryBeatCard
                                eyebrow="AI Agent"
                                title="nivo AI Agent"
                                description="A multi-agent AI team on Zalo, Telegram, and WhatsApp for sales, marketing, accounting, and operations."
                                unitCountLabel="2 plans"
                                ctaLabel="See plans"
                                onCtaPress={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
