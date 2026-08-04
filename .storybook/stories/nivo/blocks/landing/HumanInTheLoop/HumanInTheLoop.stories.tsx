import type { Meta, StoryObj } from "@storybook/nextjs"
import { HumanInTheLoop } from "@sb-components/nivo/blocks/landing/HumanInTheLoop/HumanInTheLoop"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HumanInTheLoop` — the landing's AI-accountability beat: "AI supports.
 * People stay accountable," paired with the `AiSuggestionCard` as its concrete
 * proof. Feeding the composed card a different `cardStatus` shows the pairing
 * recompute together, since this block composes the card directly rather than
 * the page arranging them separately (`nivo-landing.proposal.md` §5).
 */
const meta: Meta<typeof HumanInTheLoop> = {
    title: "Nivo/Blocks/Landing/HumanInTheLoop/HumanInTheLoop",
    component: HumanInTheLoop,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HumanInTheLoop>

const NOOP = () => {}

const COPY = {
    eyebrow: "AI stays accountable",
    headlineLead: "AI supports.",
    headlineAccent: "People stay accountable.",
    description: "nivo's AI drafts scripts, summarizes needs, and writes copy — but a human always reviews before anything goes out. AI is a support layer, never a replacement for the team.",
    ctaLabel: "See the AI Agent in action",
    cardBadgeLabel: "AI suggestion · Sales follow-up",
    cardSuggestion: "Lead \"Minh\" asked about pricing 2 days ago and hasn't heard back. Suggest sending the Pro plan offer with a consult slot.",
    cardReviewerName: "Advisor on duty",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the copy column beside the composed AI-suggestion card" },
    StackV: { tier: "frame", role: "the eyebrow / two-line headline / description / CTA stack" },
    Typography: { tier: "atom", role: "the eyebrow, two-tone headline, and description" },
    Button: { tier: "atom", role: "the secondary CTA into a live AI-Agent demo" },
    AiSuggestionCard: { tier: "block", role: "the review-state proof, composed directly by this block", storyId: "nivo-blocks-landing-aisuggestioncard-aisuggestioncard--status" },
}

/** LEAF — `cardStatus`: the composed card's own review state, proving it recomputes together with this block. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="HumanInTheLoop"
                tier="block"
                leaf="cardStatus"
                annotate={ANNOTATE}
                reason="Blocks take no `className`. The card is composed directly (not left to the page) because the proposal names the pairing as one section brief, the same shape `ProblemStatement`/`LeadLeakageMap` already use. Feeding a different `cardStatus` shows the two halves recompute together — the claim (a human stays accountable) and its proof (the review chip) never drift apart."
                states={[
                    {
                        name: "cardStatus = pending",
                        why: "The default proof: an AI-drafted suggestion still waiting on a human — the claim and its proof read the same thing at once.",
                        code: `<HumanInTheLoop
    eyebrow="AI stays accountable"
    headlineLead="AI supports."
    headlineAccent="People stay accountable."
    description={description}
    ctaLabel="See the AI Agent in action"
    onCtaPress={openDemo}
    cardBadgeLabel="AI suggestion · Sales follow-up"
    cardSuggestion={suggestion}
    cardStatus="pending"
    cardStatusLabel="Pending review"
    cardReviewerName="Advisor on duty"
/>`,
                        render: (
                            <HumanInTheLoop
                                {...COPY}
                                onCtaPress={NOOP}
                                cardStatus="pending"
                                cardStatusLabel="Pending review"
                            />
                        ),
                    },
                    {
                        name: "cardStatus = approved",
                        why: "A human has already signed off — the composed card's chip flips to success, proving the pairing is real composition, not two components drawn side by side.",
                        code: `<HumanInTheLoop {...copy} cardStatus="approved" cardStatusLabel="Approved" />`,
                        render: (
                            <HumanInTheLoop
                                {...COPY}
                                onCtaPress={NOOP}
                                cardStatus="approved"
                                cardStatusLabel="Approved"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
