import { CheckCircleIcon, HourglassIcon, SparkleIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AiSuggestionCard` — the AI-drafted suggestion sitting in a tinted note, over
 * a review row showing whether a human has signed off. `status` is the one
 * leaf: `pending` and `approved` are the two states an AI suggestion can be in
 * on this page.
 */

/** Whether a human has signed off on this AI-drafted suggestion yet. */
export type AiSuggestionCardStatus = "pending" | "approved"

/** Props for {@link AiSuggestionCard}. */
export interface AiSuggestionCardProps {
    /** Small kicker naming what the AI is suggesting for (e.g. "AI suggestion · Sales follow-up"). */
    badgeLabel: string
    /** The AI-drafted suggestion text, already resolved. */
    suggestion: string
    /** Whether a human has approved this suggestion yet — the one leaf. */
    status: AiSuggestionCardStatus
    /** Already-resolved label for the status chip (e.g. "Pending review" / "Approved"). */
    statusLabel: string
    /** The reviewing human's display name — drives the avatar initials and the trailing identity label. */
    reviewerName: string
}

/**
 * The AI-suggestion proof card. See the file header for why `status` is the
 * one leaf and why the suggestion itself sits in a `Callout`, not a bespoke
 * tinted `<div>`.
 *
 * @param props - {@link AiSuggestionCardProps}
 */
const AiSuggestionCard = ({ badgeLabel, suggestion, status, statusLabel, reviewerName }: AiSuggestionCardProps) => (
    <div data-tier="block" data-component="AiSuggestionCard">
        <SurfaceCard
            padding={3}
            body={() => (
                <StackV
                    gap={3}
                    items={[
                        () => <Callout status="accent" icon={SparkleIcon} title={badgeLabel} description={suggestion} />,
                        () => (
                            <StackH
                                gap={3}
                                justify="between"
                                align="center"
                                items={[
                                    () => (
                                        <Chip
                                            tone={status === "approved" ? "success" : "warning"}
                                            icon={status === "approved" ? CheckCircleIcon : HourglassIcon}
                                            text={statusLabel}
                                        />
                                    ),
                                    () => (
                                        <StackH
                                            gap={2}
                                            align="center"
                                            items={[
                                                () => <Avatar name={reviewerName} size="sm" />,
                                                () => <Typography size="xs" weight="semibold" text={reviewerName} />,
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { AiSuggestionCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AiSuggestionCard" } as const
