import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiSuggestionCard } from "@sb-components/nivo/blocks/landing/AiSuggestionCard/AiSuggestionCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiSuggestionCard` — the AI-drafted suggestion sitting in a tinted note, over
 * a review row showing whether a human has signed off. `status` is the one
 * leaf: `pending` and `approved` are the two states an AI suggestion can be in
 * on this page.
 */
const meta: Meta<typeof AiSuggestionCard> = {
    title: "Nivo/Blocks/Landing/AiSuggestionCard/AiSuggestionCard",
    component: AiSuggestionCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiSuggestionCard>

const BADGE = "AI suggestion · Sales follow-up"
const SUGGESTION = "Lead \"Minh\" asked about pricing 2 days ago and hasn't heard back. Suggest sending the Pro plan offer with a consult slot."
const REVIEWER = "Advisor on duty"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card face wrapping the suggestion and the review row" },
    Callout: { tier: "composite", role: "the tinted AI-suggestion note", storyId: "composites-feedback-callout--default" },
    Chip: { tier: "atom", role: "the review-status pill — warning while pending, success once approved" },
    Avatar: { tier: "atom", role: "the reviewing human's initials" },
    Typography: { tier: "atom", role: "the reviewer's display name" },
    StackH: { tier: "frame", role: "the status-chip / reviewer-identity row" },
    StackV: { tier: "frame", role: "the suggestion / review-row rhythm" },
}

/** LEAF — `status`: full coverage of both states an AI suggestion can be in. */
export const Status: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiSuggestionCard"
                tier="block"
                leaf="status"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                reason="Blocks take no `className`. The suggestion text and the review row's identity arrive already resolved — this card never sends anything on its own authority. Whether a human has already signed off is DATA (`status`), so the chip's tone and label recompute from it rather than the card assuming every suggestion is still pending."
                states={[
                    {
                        name: "pending",
                        why: "The default state right after the AI drafts a suggestion: a human still owns the send, so the chip reads a warning-toned \"pending review\".",
                        code: `<AiSuggestionCard
    badgeLabel="AI suggestion · Sales follow-up"
    suggestion={suggestion}
    status="pending"
    statusLabel="Pending review"
    reviewerName="Advisor on duty"
/>`,
                        render: (
                            <AiSuggestionCard
                                badgeLabel={BADGE}
                                suggestion={SUGGESTION}
                                status="pending"
                                statusLabel="Pending review"
                                reviewerName={REVIEWER}
                            />
                        ),
                    },
                    {
                        name: "approved",
                        why: "A human has already signed off — the chip flips to the success tone, proving the card's own tone follows the passed `status` instead of a hardcoded warning look.",
                        code: `<AiSuggestionCard
    badgeLabel="AI suggestion · Sales follow-up"
    suggestion={suggestion}
    status="approved"
    statusLabel="Approved"
    reviewerName="Advisor on duty"
/>`,
                        render: (
                            <AiSuggestionCard
                                badgeLabel={BADGE}
                                suggestion={SUGGESTION}
                                status="approved"
                                statusLabel="Approved"
                                reviewerName={REVIEWER}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
