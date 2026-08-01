import React from "react"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeHeader`: the CHALLENGE IDENTITY block, answering "what is
 * this challenge, and where do I stand on it" at the top of the solve page.
 *
 * SIBLING OF `ContentHeader`, NOT AN EDIT OF IT. Both place identity into the
 * same `PageHeader` frame, but they answer different questions with different
 * domain fields: a lesson header carries read state / reading time / challenge
 * count / outcomes, a challenge header carries score / difficulty / pass-fail
 * status. Same frame, different domain — reaching into `ContentHeader` and
 * bolting on `difficulty` would have blurred two distinct identities into one
 * prop union; a new block is the correct move (task brief, 2026-07-28).
 *
 * TWO CHIPS ON PURPOSE — a deliberate departure from `ContentHeader`'s "one
 * chip per cluster" (`starci-fe/no-adjacent-chip`, ≥2 sibling `<Chip>` in one
 * cluster). That rule exists to stop ONE fact from getting weighed twice next
 * to unrelated quiet facts. Here `difficulty` and `status` are two SEPARATE
 * classifying axes of the same challenge — difficulty is a property of the
 * CHALLENGE itself (fixed, always known), status is a property of the
 * LEARNER's attempt (may not exist yet) — neither is a duplicate of the
 * other, so both earn a chip. The lint rule itself only matches literal
 * `<Chip>` siblings; composing through two `<EnumChip>` elements does not
 * trip it, and the judgement call above is the actual reason it is safe to.
 * `scoreValue` stays quiet muted text (§14d.1: the block adds "points" itself)
 * because a raw number is not a classifying fact.
 *
 * BACK LINK, NOT BREADCRUMBS. `ContentHeader` shows a full trail because a
 * lesson is always reached through its course's outline. A challenge is
 * reached from exactly one place — the lesson that owns it — so a single
 * `LinkBack` ("← Back to {lesson}") is the correct affordance, not a chain
 * component built for N-deep navigation.
 *
 * SKELETON MIRROR FOR `LinkBack` — `LinkBack` (unlike `Breadcrumbs`) has no
 * `isSkeleton` of its own (§12g: it has no data-shaped prop that would need
 * one). Same move `ContentHeader` uses for its title: this block calls
 * `Typography` directly, sized to approximate the real link's box, and feeds
 * the shimmer into `PageHeader`'s `breadcrumb` slot — the flag still reaches
 * a real atom, just from a different caller.
 *
 * DIFFICULTY SIMPLIFIED TO THREE TIERS (`easy`/`medium`/`hard`). The source
 * app's `ChallengeDifficulty` enum also carries `insane`/`expert` for a small
 * minority of challenges with a bespoke palette (cyan/yellow/red/purple/
 * fuchsia) outside `EnumChip`'s five-tone vocabulary. This compose-only spec
 * keeps the three tiers `EnumChip` can express cleanly; extend the map the
 * day a screen actually needs the top two tiers.
 * ─────────────────────────────────────────────────────────────────────────────
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
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): `failed` gets a
 * leading icon — a failed/not-passed verdict is a "universal" symbol (cross),
 * not decoration. `completed`/`inProgress` stay text-only; extend the day a
 * screen actually asks for their icon too, not preemptively.
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
    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-7, teacher's final
    // call on the still-open score-1 issue, round-3: "move the red one to the
    // left, put the yellow one right next to it, then give these three an even
    // gap" — then revised the order again: "chip on the left, plain text on
    // the right"): dropped `justify="between"` + a two-tier nested StackH (which
    // used to push score to the left edge and status/difficulty to the right
    // edge) — merged into ONE row, all with the same `gap={3}`, sitting close
    // together on the left, CHIPS FIRST (status, difficulty) then the score as
    // plain text. Still dropped `prefixIcon={TrophyIcon}` (round-2) and kept the
    // status-before-difficulty order (round-2).
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
                meta={() =>
                    <StackH gap={3} align="center" body={metaRow} />
                }
            />
        </div>
    )
}

export { ChallengeHeader }
