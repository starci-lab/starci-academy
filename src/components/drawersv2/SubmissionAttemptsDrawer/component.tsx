import React, { useEffect, useMemo, useState } from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { EnumChip } from "@/components/composites/chips/EnumChip"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { MODEL_CATEGORY_MAP, type AiModelCategory } from "@/components/starci/blocks/learn/SubmissionScoreCard"
import { Pagination } from "@/components/atoms/navigation/Pagination"

/**
 * `_SubmissionAttemptsDrawer` — the full graded history of one challenge requirement:
 * every past attempt, client-paginated (6 per page), opened over the result screen.
 * Tapping any row both selects that attempt and closes the drawer. Composes
 * `DrawerShell` + `AsyncContent` + `SurfaceCard.List`, reusing the model-byline
 * recipe (`EnumChip`/`InlineIconLabel`/`MODEL_CATEGORY_MAP`).
 *
 * Takes the whole `attempts` array and slices it client-side (page resets to 1 on
 * open). One `AttemptRow` leaf; pass/fail, model present/absent, and time-ago
 * present/absent are states of it.
 *
 * Ported from `.storybook/components/starci/overlays/drawers/SubmissionAttemptsDrawer/SubmissionAttemptsDrawer.tsx`
 * (renamed export only — see `index.tsx` for the connected wiring notes).
 */

/** One past graded attempt at this challenge requirement. */
export interface SubmissionAttemptRecord {
    /** Stable id — the value reported to {@link SubmissionAttemptsDrawerProps.onSelect}. */
    id: string
    /** 1-based order the attempt was made in — the row turns this into "Attempt N". */
    attemptNumber: number
    /** `null` → not graded yet; the row shows an "ungraded" chip instead of a number. */
    score: number | null
    /** Denominator for `score`. `null` → the score renders bare (no "/max"). */
    maxScore: number | null
    /** Drives the verdict icon + `Chip` tone once `score` is set — pass (`success`) or fail (`danger`). */
    isPassing: boolean
    /** Already-humanized relative time (e.g. "2 hours ago"). Absent → the byline row drops the time. */
    processedTimeAgo?: string
    /** The model that graded this attempt. Absent → the byline row does not draw at all (same rule `SubmissionScoreCard` uses). */
    gradedByModel?: string
    /** Cost/quality tier of {@link gradedByModel}. */
    modelCategory?: AiModelCategory
}

/** Props for {@link _SubmissionAttemptsDrawer}. */
export interface SubmissionAttemptsDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button, or a row selection). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The FULL attempt history (newest first) — this block paginates it client-side, same as real `src`. */
    attempts: Array<SubmissionAttemptRecord>
    /** The attempt currently being viewed — highlighted with a trailing check. */
    selectedAttemptId?: string
    /** Fired with an attempt id when the reader taps its row. The drawer closes itself right after (same gesture as real `src`). */
    onSelect: (attemptId: string) => void
    /** `true` → this list's own fetch is in flight; the drawer shows its skeleton mirror. */
    isLoading?: boolean
    /** `true` (once loading has finished) → the drawer falls to its empty message. */
    isEmpty?: boolean
    /** Truthy → the drawer falls to its error message (beats loading, per `AsyncContent`). */
    error?: unknown
    /** Retry handler — paired with `retryLabel` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Label of the retry button — required alongside `onRetry` for it to appear. */
    retryLabel?: string
    /** Which edge the panel slides in from. Real `src` picks bottom-on-mobile itself; this port leaves that call to the caller. @default "right" */
    placement?: "top" | "bottom" | "left" | "right"
}

/** Fixed, block-owned title (§14d.1) — real `src` appends the live count, so this does too. */
const DRAWER_TITLE = "Submission history"
const EMPTY_TITLE = "No submissions yet"
const ERROR_TITLE = "Couldn't load the submission history"
const PAGER_ARIA_LABEL = "Submission history pagination"
const UNGRADED_LABEL = "Ungraded"

/** Attempts per page — same constant real `src` uses. */
const HISTORY_PAGE_SIZE = 6
/** How many skeleton rows mirror the list while `attempts` hasn't landed yet. */
const SKELETON_ATTEMPT_COUNT = 3

/** One attempt's verdict `Chip` shape — tone/icon/text, all derived from data. */
const scoreChipFor = (attempt: SubmissionAttemptRecord): { tone: "success" | "danger" | "default"; icon?: typeof CheckCircleIcon; text: string } => {
    if (attempt.score == null) {
        return { tone: "default", text: UNGRADED_LABEL }
    }
    return {
        tone: attempt.isPassing ? "success" : "danger",
        icon: attempt.isPassing ? CheckCircleIcon : XCircleIcon,
        text: attempt.maxScore != null ? `${attempt.score}/${attempt.maxScore}` : `${attempt.score}`,
    }
}

/** Turns one attempt into a {@link SurfaceCardListItem}'s free-form `content` — mirrors real `src`'s row exactly: attempt line + verdict chip + time-ago on line 1, model byline on line 2. */
const attemptRowContent = (attempt: SubmissionAttemptRecord, isSelected: boolean) => {
    const chip = scoreChipFor(attempt)

    const attemptLabelAndChip = [
        () => (
            <Typography
                text={`Attempt ${attempt.attemptNumber}`}
                size="sm"
                weight="medium"

            />
        ),
        () => <Chip tone={chip.tone} icon={chip.icon} text={chip.text} />,
    ]

    // justify="between" pushes the timeago to the far edge — the PARENT does the
    // pushing, not a child margin; the label+chip stay grouped in their own inner track
    // so `between` only ever splits two things, not three.
    const attemptLineContent = [
        () => <StackH gap={3} principles={["chip-row"]} align="center" items={attemptLabelAndChip} />,
        ...(attempt.processedTimeAgo != null ? [() => (
            <Typography
                text={attempt.processedTimeAgo}
                size="xs"
                color="muted"

            />
        )] : []),
    ]

    const bylineContent = [
        () => (
            <InlineIconLabel
                icon={SparkleIcon}
                tone="default"
                size="xs"
                label={`Graded by ${attempt.gradedByModel}`}
            />
        ),
        ...(attempt.modelCategory != null ? [() => (
            <EnumChip
                value={attempt.modelCategory ?? ""}
                map={MODEL_CATEGORY_MAP}

            />
        )] : []),
    ]

    const rowContent = [
        () => (
            <StackH
                gap={3}
                principles={["sibling-stack"]}
                align="center"
                justify="between"

                items={attemptLineContent}
            />
        ),
        ...(attempt.gradedByModel != null ? [() => (
            <StackH gap={3} principles={["chip-row"]} align="center" at="sm" items={bylineContent} />
        )] : []),
    ]

    // highlight-exception: the selected row's tint is baked into the row's own
    // content wrapper (a plain, un-tightened `<div>`), since `SurfaceCardListItem`
    // no longer takes a raw `className` — same class real `src`'s
    // `SurfaceListCardItem` uses.
    return (
        <div className={isSelected ? "bg-accent-soft hover:bg-accent-soft" : undefined}>
            <StackV gap={2} items={rowContent} />
        </div>
    )
}

/**
 * The attempts-history drawer. See the file header for the real-`src` rebuild
 * and why selecting a row closes the drawer in the same gesture.
 *
 * @param props - {@link SubmissionAttemptsDrawerProps}
 */
const _SubmissionAttemptsDrawer = ({
    isOpen,
    onOpenChange,
    attempts,
    selectedAttemptId,
    onSelect,
    isLoading = false,
    isEmpty = false,
    error,
    onRetry,
    retryLabel,
    placement = "right",
}: SubmissionAttemptsDrawerProps) => {
    const [page, setPage] = useState(1)

    // reset to the first page whenever the drawer opens — same as real `src`.
    useEffect(() => {
        if (isOpen) {
            setPage(1)
        }
    }, [isOpen])

    const totalPages = Math.max(1, Math.ceil(attempts.length / HISTORY_PAGE_SIZE))
    const pagedAttempts = useMemo(
        () => attempts.slice((page - 1) * HISTORY_PAGE_SIZE, page * HISTORY_PAGE_SIZE),
        [attempts, page],
    )

    const emptyContent: AsyncContentEmptyProps = {
        title: EMPTY_TITLE,

    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel,

    }

    const skeletonRows = Array.from({ length: SKELETON_ATTEMPT_COUNT }, () => () => (
        <div className="h-16 w-full rounded-2xl bg-default/40" />
    ))

    // `selected` (a trailing check) is only wired for the FIXED title/subtitle row
    // shape — this row uses free-form `content` instead (2 lines, richer than that
    // shape fits), so the highlight is baked into `attemptRowContent`'s own wrapper
    // div, same class real `src`'s `SurfaceListCardItem` uses.
    const items: Array<SurfaceCardListItem> = pagedAttempts.map((attempt) => ({
        key: attempt.id,
        content: () => attemptRowContent(attempt, attempt.id === selectedAttemptId),
        onPress: () => {
            onSelect(attempt.id)
            onOpenChange(false)
        },
    }))

    const listAndPager = [
        () => (
            <SurfaceCardList
                items={items}


            />
        ),
        ...(totalPages > 1 ? [() => (
            // `Pagination` hard-codes its own internal `aria-label` (§4) — the
            // wrapping `<nav>` is how this block's own accessible name still
            // gets attached, same convention `CourseQaQuestionList` uses.
            <nav aria-label={PAGER_ARIA_LABEL}>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}

                />
            </nav>
        )] : []),
    ]

    return (
        <DrawerShell
            data-tier="overlay"
            data-component="SubmissionAttemptsDrawer"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={placement}
            title={`${DRAWER_TITLE} · ${attempts.length}`}
            body={() => (
                <AsyncContent
                    isLoading={isLoading}
                    skeleton={() => (
                        <StackV
                            gap={3}

                            items={skeletonRows}
                        />
                    )}
                    isEmpty={isEmpty}
                    emptyContent={emptyContent}
                    error={error}
                    errorContent={errorContent}

                    content={() => (
                        <StackV
                            gap={4}


                            items={listAndPager}
                        />
                    )}
                />
            )}
        />
    )
}

export { _SubmissionAttemptsDrawer }
