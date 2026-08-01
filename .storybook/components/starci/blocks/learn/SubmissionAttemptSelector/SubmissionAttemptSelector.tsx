import React from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ButtonRadioGroup, type ButtonRadioGroupItem } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SubmissionAttemptSelector`: which GRADED ATTEMPT the reader is looking
 * at. A flex-wrap row of attempt buttons — verdict + "Attempt N" + score — plus an
 * optional "+N" trigger for whatever else holds the rest of the history.
 *
 * WHY A BLOCK: turning `{ attemptNumber, score, isPassing }` into "Attempt 3 · 82"
 * with a pass/fail glyph is DOMAIN wording (§14d.1) — the caller hands over
 * attempt data, never a pre-built label or icon. That composition, plus the
 * few-vs-many decision (does an overflow trigger even belong on this row), is
 * the entire reason this sits above the atoms it wraps.
 *
 * ⭐ REUSE, NOT A NEW SHAPE (the exact mistake this task exists to avoid — see
 * `ContentModeNav`'s header). Two atoms already draw everything this row needs:
 *   • `ButtonRadioGroup` — the SELECT semantics (`role="group"`, `aria-pressed`,
 *     flex-wrap, filled-vs-ghost on selection). This block does not hand-roll a
 *     pressable pill.
 *   • `Chip` — the verdict+label LAYOUT (icon slot, `tone` colour, text). Each
 *     attempt's `Chip` rides *inside* a `ButtonRadioGroup` item's `content`, so
 *     two independent signals stay on two independent channels instead of one
 *     prop trying to carry both: the OUTER button variant says "is this the one
 *     I'm viewing", the INNER chip's tone says "did this attempt pass" — neither
 *     fact would survive being folded into the other (a selected-but-failing
 *     attempt needs both true at once).
 *   • The "+N" trigger is `ButtonRadioGroup`'s own documented `trailing` slot
 *     ("optional trailing node … e.g. a '+N' overflow button") — not a node this
 *     block invented next to it.
 *
 * ⛔ SCOPE (out of reach this pass, per the task's own risk note): pressing "+N"
 * only fires `onOverflowPress`. What it opens — a history drawer, a modal, a
 * route — is a SCREEN decision (Rule 7: a block never swallows an event on
 * business grounds), so this row does not know or care what "+N" leads to.
 *
 * JUDGEMENT CALLS:
 *   • `isSkeleton` (the canon-standard prop every component carries) and
 *     `isLoading` (this widget's own async fetch) both fall to `AsyncContent`'s
 *     ONE loading branch — `AsyncContent` only exposes a single loading concept,
 *     so a parent forcing an all-skeleton paint and this row's own in-flight
 *     fetch are the same branch, not two the block would have to reconcile.
 *   • `selectedId` is OPTIONAL (nothing picked yet is a real state — first
 *     paint, before the reader has looked at any attempt) but the atom's
 *     `value` is not; a sentinel `""` stands in for "none", safe because no
 *     attempt id is ever the empty string.
 *   • ONE leaf, `AttemptRow` — every difference below (loading / empty / error
 *     / few attempts / many attempts) is the SAME chip strip wearing a
 *     different piece of content, never a different structure, so none of them
 *     earns its own leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One graded attempt the reader can switch to. */
export interface SubmissionAttempt {
    /** Stable id — the value reported to {@link SubmissionAttemptSelectorProps.onSelect}. */
    id: string
    /** 1-based order the attempt was made in — the block turns this into "Attempt N". */
    attemptNumber: number
    /** `null` → not graded yet (or ungraded by design); shown without a score. */
    score: number | null
    /** Drives the verdict glyph + `Chip` tone — pass (`success`) or fail (`danger`). */
    isPassing: boolean
}

/** Props for {@link SubmissionAttemptSelector}. */
export interface SubmissionAttemptSelectorProps {
    /** The attempts offered, in display order. */
    attempts: Array<SubmissionAttempt>
    /** The attempt currently being viewed. Unset → none selected yet. */
    selectedId?: string
    /** Fired with the id of the attempt the reader picked. */
    onSelect: (id: string) => void
    /** Accessible name for the row, localized by the caller (blocks carry no i18n). */
    ariaLabel: string
    /** How many MORE attempts exist beyond this row — set (and > 0) → the "+N" trigger shows. */
    overflowCount?: number
    /** Label for the "+N" trigger. Defaults to `+{overflowCount}` when omitted. */
    overflowLabel?: string
    /**
     * Fired when the reader presses "+N". What that opens is the CALLER's call
     * (Rule 7) — a history drawer, a modal, a route change — this block only
     * reports the press.
     */
    onOverflowPress?: () => void
    /** `true` → this row's own fetch is in flight; the strip shows its skeleton mirror. */
    isLoading?: boolean
    /** `true` (once loading has finished) → the row falls to its empty message. */
    isEmpty?: boolean
    /** Empty-state message. Defaults to a standard "no attempts yet" line. */
    emptyLabel?: string
    /** Truthy → the row falls to its error message (beats loading, per `AsyncContent`). */
    error?: unknown
    /** Retry handler — paired with `retryLabel` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Label of the retry button — required alongside `onRetry` for it to appear. */
    retryLabel?: string
    /** `true` → a parent-forced skeleton paint, same branch as `isLoading` (see file header). */
    isSkeleton?: boolean
}

const EMPTY_LABEL_DEFAULT = "No attempts to choose from yet"
const ERROR_TITLE = "Couldn't load the attempt list"

/** No attempt id is ever the empty string, so `""` safely reads as "none selected". */
const NONE_SELECTED = ""

/** How many skeleton pills mirror the strip while `attempts` hasn't landed yet. */
const SKELETON_ITEM_COUNT = 3

/** Turns one attempt into its `Chip` — the verdict glyph, "Attempt N", and its score. */
const attemptChip = (attempt: SubmissionAttempt) => (
    <Chip
        icon={attempt.isPassing ? CheckCircleIcon : XCircleIcon}
        tone={attempt.isPassing ? "success" : "danger"}
        text={attempt.score != null ? `Attempt ${attempt.attemptNumber} · ${attempt.score}` : `Attempt ${attempt.attemptNumber}`}

    />
)

/** Props for {@link AttemptRowSkeleton}. */
interface AttemptRowSkeletonProps {
}

/** Mirrors the real strip's footprint while attempts are loading — pill-for-pill, no data. */
const AttemptRowSkeleton = ({  }: AttemptRowSkeletonProps) => (
    <Cluster
        gap={3}

        items={Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => ({
            key: `skeleton-${index}`,
            content: <Button isSkeleton size="sm" />,
        }))}
    />
)

/**
 * The graded-attempt row. See the file header for what it owns (verdict+label
 * wording, the few-vs-many decision) and what it deliberately does not (what
 * "+N" opens).
 *
 * @param props - {@link SubmissionAttemptSelectorProps}
 */
const SubmissionAttemptSelector = ({
    attempts,
    selectedId,
    onSelect,
    ariaLabel,
    overflowCount,
    overflowLabel,
    onOverflowPress,
    isLoading = false,
    isEmpty = false,
    emptyLabel,
    error,
    onRetry,
    retryLabel,
    isSkeleton = false,
}: SubmissionAttemptSelectorProps) => {
    const hasOverflow = (overflowCount ?? 0) > 0

    const emptyContent: AsyncContentEmptyProps = {
        title: emptyLabel ?? EMPTY_LABEL_DEFAULT,

    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel,

    }

    const items: Array<ButtonRadioGroupItem<string>> = attempts.map((attempt) => ({
        value: attempt.id,
        content: attemptChip(attempt),
    }))

    return (
        <div>
            <AsyncContent
                // A parent-forced skeleton and this row's own in-flight fetch share the
                // one loading branch `AsyncContent` exposes (see file header).
                isLoading={isLoading || isSkeleton}
                skeleton={<AttemptRowSkeleton />}
                isEmpty={isEmpty}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}

                content={
                    <ButtonRadioGroup
                        ariaLabel={ariaLabel}
                        value={selectedId ?? NONE_SELECTED}
                        onChange={onSelect}
                        items={items}

                        trailing={
                            hasOverflow ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    label={overflowLabel ?? `+${overflowCount}`}
                                    onPress={onOverflowPress}

                                />
                            ) : undefined
                        }
                    />
                }
            />
        </div>
    )
}

export { SubmissionAttemptSelector }
