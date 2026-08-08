import React from "react"
import { ClockIcon, SparkleIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    AsyncContentEmpty,
    AsyncContentError,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PersonalProjectTaskAttemptsDrawer` — presentational-only overlay drawer
 * listing the AI-review attempts for ONE personal-project milestone task: an
 * attempt-number label + sparkle/score chip, a short feedback line, and a
 * clock + processed-time line per attempt. No pagination, no footer —
 * genuinely simpler than the challenge-side `SubmissionAttemptsDrawer`.
 */

/** One AI-graded attempt at a personal-project milestone task. */
export interface PersonalProjectTaskAttempt {
    /** Stable id — the row's React key. */
    id: string
    /** 1-based order the attempt was made in — the block turns this into "Attempt N". */
    attemptNumber: number
    /** Points earned on this attempt. `null` → not graded yet (AI review still running). */
    score: number | null
    /** A short line of grader feedback, plain text. `null` → the line drops (§2, not every attempt carries one). */
    shortFeedback: string | null
    /** When this attempt was processed, already localized by the caller (dayjs/locale is app-layer logic). */
    processedAtLabel: string
}

/** Props for {@link PersonalProjectTaskAttemptsDrawer}. */
export interface PersonalProjectTaskAttemptsDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /**
     * Which edge the panel slides in from. @default "right"
     *
     * Caller-decided (Rule 13): the real app derives this from a viewport hook
     * (narrow screens open a bottom sheet instead), which is app wiring — this
     * block only accepts the resolved value.
     */
    placement?: "right" | "bottom"
    /** The attempts for this task, in display order. */
    attempts: Array<PersonalProjectTaskAttempt>
    /** `true` → this drawer's own fetch is in flight; the list shows its skeleton mirror. */
    isLoading?: boolean
    /** Empty-state message. Defaults to a standard "no attempts yet" line. */
    emptyLabel?: string
    /** Truthy → the list falls to its error message (beats loading, per `AsyncContent`). */
    error?: unknown
    /** Retry handler — paired with `retryLabel` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Label of the retry button — required alongside `onRetry` for it to appear. */
    retryLabel?: string
    /** `true` → a parent-forced skeleton paint, same branch as `isLoading` (see file header). */
    isSkeleton?: boolean
}

/** Fixed, block-owned title — this drawer's whole reason to exist is this one list. */
const DRAWER_TITLE = "AI grading history"

const EMPTY_LABEL_DEFAULT = "No submissions yet for this task."
const ERROR_TITLE = "Couldn't load the AI grading history"

/** How many skeleton rows mirror the list while `attempts` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Props for the local {@link AttemptRow} leaf. */
interface AttemptRowProps {
    /** The attempt's data. Omitted only in the skeleton branch. */
    attempt?: PersonalProjectTaskAttempt
    /** Resting state — the row keeps its shape, only the text shimmers. */
    isSkeleton?: boolean
}

/**
 * ONE attempt row: attempt-number label + sparkle/score chip on one line, an
 * optional feedback line, and a clock + processed-time line. The SAME shape
 * renders for real data and for the skeleton mirror (`isSkeleton` flips which
 * parts shimmer) — no second, hand-drawn placeholder tree (§6b).
 */
const AttemptRow = ({ attempt, isSkeleton = false}: AttemptRowProps) => {
    const scoreTone: ChipTone = attempt?.score != null ? "accent" : "default"
    const scoreLabel = attempt?.score != null ? `${attempt.score} points` : "Grading"
    // A missing attempt (real, §2) drops the line; the skeleton branch always
    // reserves it so the mirror's footprint matches a typical populated row.
    const showFeedback = isSkeleton || attempt?.shortFeedback != null

    const attemptLabelAndChip = [
        () => (
            <Typography
                size="sm"
                weight="medium"
                isSkeleton={isSkeleton}

                text={attempt != null ? `Attempt ${attempt.attemptNumber}` : undefined}

            />
        ),
        () => (
            <Chip
                icon={SparkleIcon}
                tone={scoreTone}
                isSkeleton={isSkeleton}
                text={scoreLabel}
            />
        ),
    ]

    const rowLines = [
        () => (
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                justify="between"
                at="sm"
                isSkeleton={isSkeleton}

                items={attemptLabelAndChip}
            />
        ),
        ...(showFeedback ? [() => (
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}

                text={attempt?.shortFeedback ?? undefined}

            />
        )] : []),
        () => (
            <InlineIconLabel
                icon={ClockIcon}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                label={attempt?.processedAtLabel ?? ""}
            />
        ),
    ]

    return (
        <StackV gap={2} isSkeleton={isSkeleton} items={rowLines} />
    )
}

/**
 * The AI-review attempts drawer. See the file header for why it is free-form
 * (not `SurfaceCardList`'s fixed row) and why it carries no pagination/footer.
 *
 * @param props - {@link PersonalProjectTaskAttemptsDrawerProps}
 */
const PersonalProjectTaskAttemptsDrawer = ({
    isOpen,
    onOpenChange,
    placement = "right",
    attempts,
    isLoading = false,
    emptyLabel,
    error,
    onRetry,
    retryLabel,
    isSkeleton = false,
}: PersonalProjectTaskAttemptsDrawerProps) => {
    const emptyContent: AsyncContentEmptyProps = {
        title: emptyLabel ?? EMPTY_LABEL_DEFAULT,

    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel,

    }

    const skeletonItems: Array<SurfaceCardListItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
        key: `skeleton-${index}`,
        content: () => <AttemptRow isSkeleton />,
    }))

    const items: Array<SurfaceCardListItem> = attempts.map((attempt) => ({
        key: attempt.id,
        content: () => <AttemptRow attempt={attempt} />,
    }))

    // A parent-forced skeleton and this drawer's own in-flight fetch share one flag.
    const loading = isLoading || isSkeleton

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={placement}
            title={DRAWER_TITLE}
            body={() => (
                // One list owns all four states — error → skeleton → empty → content.
                // While loading it renders placeholder rows (the real items are still
                // empty) with the shimmer flowing down through `isSkeleton`; empty and
                // error are the shared `AsyncContent*` frames dropped in as its own slots.
                <SurfaceCardList
                    items={loading ? skeletonItems : items}
                    isSkeleton={loading}
                    error={error}
                    errorState={() => <AsyncContentError {...errorContent} />}
                    emptyState={() => <AsyncContentEmpty {...emptyContent} />}
                    identity={{ tier: "overlay", component: "PersonalProjectTaskAttemptsDrawer" }}
                />
            )}
        />
    )
}

export { PersonalProjectTaskAttemptsDrawer }
