import React from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ChallengeHeader` — the challenge-identity cluster atop the solve page: back
 * link, title, optional description, and a meta row carrying score, difficulty,
 * and the learner's pass-fail status. A `PageHeader` cluster. Two chips on
 * purpose — `difficulty` (a property of the challenge) and `status` (a property
 * of the attempt) are separate axes. Whether the status chip draws, and loading,
 * are data.
 */

/** How hard the challenge is — a property of the CHALLENGE, always known. */
export type ChallengeDifficulty = "easy" | "medium" | "hard"

/** Where the learner's own attempt stands — a property of the ATTEMPT, may not exist yet. */
export type ChallengeStatus = "completed" | "failed" | "inProgress"

/** Difficulty → chip presentation. The block owns this table (§14d.1: no caller-supplied color). */
const DIFFICULTY_MAP: Record<ChallengeDifficulty, EnumChipEntry> = {
    easy: { color: "success", label: "Easy" },
    medium: { color: "warning", label: "Medium" },
    hard: { color: "danger", label: "Hard" },
}

/**
 * Attempt status → chip presentation.
 *
 * `failed` gets a leading icon — a failed/not-passed verdict is a "universal"
 * symbol (cross), not decoration. `completed`/`inProgress` stay text-only; extend
 * the day a screen actually asks for their icon too, not preemptively.
 */
const STATUS_MAP: Record<ChallengeStatus, EnumChipEntry> = {
    completed: { color: "success", label: "Passed" },
    failed: { color: "danger", label: "Failed", icon: "cross" },
    inProgress: { color: "warning", label: "In progress" },
}

/** Props for {@link ChallengeHeader}. */
export interface ChallengeHeaderProps {
    /** Fired when the back link is pressed — the block never owns routing, only the affordance. */
    onBackPress: () => void
    /** Full back-link label override; omit to fall back to `LinkBack`'s generic "Back". */
    backLabel?: string
    /** Challenge title. */
    title: string
    /** One-sentence summary of the challenge. */
    description?: string
    /**
     * Points this challenge is worth, in RAW NUMBER — the block adds the unit
     * itself ("{n} points", §14d.1). Omit when no score is defined yet.
     */
    scoreValue?: number
    /**
     * How hard the challenge is. Always required — every challenge has a fixed
     * difficulty tier independent of whether the learner has attempted it yet.
     */
    difficulty: ChallengeDifficulty
    /**
     * The learner's own attempt outcome. Omit when the learner has not
     * attempted this challenge — the status chip is not drawn at all rather
     * than showing a "not started" chip nobody asked for.
     */
    status?: ChallengeStatus
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
}

/**
 * The challenge identity cluster at the top of the solve page. See the file
 * header for why it is a sibling of `ContentHeader` rather than an edit of it.
 *
 * @param props - {@link ChallengeHeaderProps}
 */
const ChallengeHeader = ({
    onBackPress,
    backLabel,
    title,
    description,
    scoreValue,
    difficulty,
    status,
    isSkeleton = false,
}: ChallengeHeaderProps) => {
    // ONE row, all with the same `gap={3}`, sitting close together on the left:
    // CHIPS FIRST (status, difficulty) then the score as plain text. No
    // `prefixIcon={TrophyIcon}`, and status comes before difficulty.
    const metaRow = (
        <>
            {isSkeleton ? (
                <EnumChip
                    value="inProgress"
                    map={STATUS_MAP}
                    isSkeleton

                />
            ) : status != null ? (
                <EnumChip
                    value={status}
                    map={STATUS_MAP}

                />
            ) : null}
            {isSkeleton ? (
                <EnumChip
                    value="easy"
                    map={DIFFICULTY_MAP}
                    isSkeleton

                />
            ) : (
                <EnumChip
                    value={difficulty}
                    map={DIFFICULTY_MAP}

                />
            )}
            {isSkeleton ? (
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/4"]} />
            ) : scoreValue != null ? (
                <Typography
                    size="xs"
                    color="muted"
                    text={`${scoreValue} points`}

                />
            ) : null}
        </>
    )

    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton ? (
                        <Typography size="sm" isSkeleton classNames={["w-1/4"]} />
                    ) : (
                        <LinkBack
                            label={backLabel}
                            onPress={onBackPress}

                        />
                    )
                }
                title={title}
                // `PageHeader.description` is now a plain `string` (COMPOSITE-4), so this
                // block no longer wraps it in `RichText` at the call site — the field is
                // already typed/documented as a plain one-sentence summary, never markdown,
                // and `PageHeader` now owns the muted styling + skeleton swap itself.
                description={description}
                meta={({ isSkeleton }: SkeletonProps) =>
                    <StackH gap={3} align="center" pattern="chip-row" isSkeleton={isSkeleton} items={[() => metaRow]} />
                }
            />
        </div>
    )
}

export { ChallengeHeader }
