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
 * `SubmissionAttemptSelector` — which graded attempt the reader is looking at: a
 * flex-wrap row of attempt buttons (verdict + "Attempt N" + score) plus an optional
 * "+N" trigger for the rest of the history. The select chrome is `ButtonRadioGroup`
 * and each button's content is a `Chip`; the block turns `{ attemptNumber, score,
 * isPassing }` into that composition, and the "+N" trigger uses the group's own
 * `trailing` slot. Pressing "+N" only fires `onOverflowPress` — what it opens is a
 * screen decision. Loading, empty, error, few, and many attempts are all states of
 * the one chip strip.
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

        items={Array.from({ length: SKELETON_ITEM_COUNT }, () => () => <Button isSkeleton size="sm" />)}
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
                skeleton={() => <AttemptRowSkeleton />}
                isEmpty={isEmpty}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}

                content={() => (
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
                )}
            />
        </div>
    )
}

export { SubmissionAttemptSelector }
