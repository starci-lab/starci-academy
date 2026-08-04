import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    AiSuggestionCard,
    type AiSuggestionCardStatus,
} from "@sb-components/nivo/blocks/landing/AiSuggestionCard/AiSuggestionCard"

/**
 * `HumanInTheLoop` — the landing's AI-accountability beat: "AI supports.
 * People stay accountable," paired with the `AiSuggestionCard` as its concrete
 * proof. Feeding the composed card a different `cardStatus` shows the pairing
 * recompute together, since this block composes the card directly rather than
 * the page arranging them separately (`nivo-landing.proposal.md` §5).
 */

/** Props for {@link HumanInTheLoop}. */
export interface HumanInTheLoopProps {
    /** Accent-toned kicker above the headline. */
    eyebrow: string
    /** First headline line, default foreground (e.g. "AI supports."). */
    headlineLead: string
    /** Second headline line, accent-colored (e.g. "People stay accountable."). */
    headlineAccent: string
    /** Supporting paragraph naming what the AI does and does not decide. */
    description: string
    /** Visible label for the secondary CTA. */
    ctaLabel: string
    /** Fired by the CTA — the caller routes toward a live AI-Agent demo. */
    onCtaPress: () => void
    /** Kicker for the composed {@link AiSuggestionCard} (e.g. "AI suggestion · Sales follow-up"). */
    cardBadgeLabel: string
    /** The AI-drafted suggestion text for the composed card. */
    cardSuggestion: string
    /** Whether a human has approved the composed card's suggestion yet. */
    cardStatus: AiSuggestionCardStatus
    /** Already-resolved status-chip label for the composed card. */
    cardStatusLabel: string
    /** The reviewing human's display name for the composed card. */
    cardReviewerName: string
}

/**
 * The human-in-the-loop beat. See the file header for why it composes
 * `AiSuggestionCard` directly instead of leaving the pairing to the page.
 *
 * @param props - {@link HumanInTheLoopProps}
 */
const HumanInTheLoop = ({
    eyebrow,
    headlineLead,
    headlineAccent,
    description,
    ctaLabel,
    onCtaPress,
    cardBadgeLabel,
    cardSuggestion,
    cardStatus,
    cardStatusLabel,
    cardReviewerName,
}: HumanInTheLoopProps) => (
    <div data-tier="block" data-component="HumanInTheLoop">
        <Grid
            columns={{ base: 1, lg: 2 }}
            gap={8}
            items={[
                {
                    key: "copy",
                    content: () => (
                        <StackV
                            gap={4}
                            align="start"
                            items={[
                                () => <Typography size="sm" weight="semibold" color="accent" text={eyebrow} />,
                                () => (
                                    <StackV
                                        gap={1}
                                        items={[
                                            () => <Typography size="h2" weight="bold" text={headlineLead} />,
                                            () => <Typography size="h2" weight="bold" color="accent" text={headlineAccent} />,
                                        ]}
                                    />
                                ),
                                () => <Typography size="base" color="muted" text={description} />,
                                () => (
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        label={ctaLabel}
                                        suffixIcon={ArrowRightIcon}
                                        iconSlide
                                        onPress={onCtaPress}
                                    />
                                ),
                            ]}
                        />
                    ),
                },
                {
                    key: "card",
                    content: () => (
                        <AiSuggestionCard
                            badgeLabel={cardBadgeLabel}
                            suggestion={cardSuggestion}
                            status={cardStatus}
                            statusLabel={cardStatusLabel}
                            reviewerName={cardReviewerName}
                        />
                    ),
                },
            ]}
        />
    </div>
)

export { HumanInTheLoop }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "HumanInTheLoop" } as const
