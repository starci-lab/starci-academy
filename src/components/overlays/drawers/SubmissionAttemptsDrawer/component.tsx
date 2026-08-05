import React, { useEffect, useMemo, useState } from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { DrawerShell } from "@/components/composites/layout/DrawerShell"
import {
    AsyncContentEmpty,
    AsyncContentError,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@/components/composites/async/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { EnumChip } from "@/components/composites/chips/EnumChip"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { MODEL_CATEGORY_MAP, type AiModelCategory } from "@/components/blocks/learn/SubmissionScoreCard"
import { Pagination } from "@/components/atoms/navigation/Pagination"

/**
 * `_SubmissionAttemptsDrawer` — the full graded history of one challenge requirement:
 * every past attempt, client-paginated (6 per page), opened over the result screen.
 * Tapping any row both selects that attempt and closes the drawer. Composes
 * `DrawerShell` + `SurfaceCardList` (free-form rows), reusing the model-byline
 * recipe (`EnumChip`/`InlineIconLabel`/`MODEL_CATEGORY_MAP`).
 *
 * Loading is the co-located `isSkeleton` idiom (`loading-and-skeleton.md`): one row
 * function, `attemptRowContent`, renders BOTH the real row and the placeholder row —
 * `attempt` is only omitted for the placeholders, and every leaf shimmers through the
 * same flag. Error/empty are the shared `AsyncContentError`/`AsyncContentEmpty` frames,
 * dropped into `SurfaceCardList`'s own `errorState`/`emptyState` slots (`isEmpty` is
 * derived by that list from `items.length`, never passed in as a separate flag). The
 * selected row's highlight is `SurfaceCardListItem`'s own `tone="accent"` left-edge
 * band — no hand-rolled tint `<div>`.
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
    /** The attempt currently being viewed — highlighted with a left accent band. */
    selectedAttemptId?: string
    /** Fired with an attempt id when the reader taps its row. The drawer closes itself right after (same gesture as real `src`). */
    onSelect: (attemptId: string) => void
    /**
     * `true` → this list's own fetch is the FIRST load, nothing in hand yet — every
     * row mirrors itself as a shimmer instead of a hand-built placeholder tree.
     */
    isSkeleton?: boolean
    /** Truthy → the list falls to its error message (beats the skeleton, per `SurfaceCardList`). */
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
interface AttemptChipShape {
    tone: "success" | "danger" | "default"
    icon?: typeof CheckCircleIcon
    text?: string
}

const scoreChipFor = (attempt: SubmissionAttemptRecord): AttemptChipShape => {
    if (attempt.score == null) {
        return { tone: "default", text: UNGRADED_LABEL }
    }
    return {
        tone: attempt.isPassing ? "success" : "danger",
        icon: attempt.isPassing ? CheckCircleIcon : XCircleIcon,
        text: attempt.maxScore != null ? `${attempt.score}/${attempt.maxScore}` : `${attempt.score}`,
    }
}

/**
 * Turns one attempt into the list row's free-form content — attempt line + verdict
 * chip + time-ago on line 1, model byline on line 2. `attempt` is omitted only for
 * the skeleton placeholder rows, which render this SAME tree with `isSkeleton` on
 * every leaf (§ `loading-and-skeleton.md`) instead of a second, hand-built shape.
 */
const attemptRowContent = (attempt: SubmissionAttemptRecord | undefined, isSkeleton: boolean) => {
    const chip: AttemptChipShape = attempt ? scoreChipFor(attempt) : { tone: "default" }

    const attemptLabelAndChip = [
        () => (
            <Typography
                text={attempt != null ? `Attempt ${attempt.attemptNumber}` : undefined}
                size="sm"
                weight="medium"
                isSkeleton={isSkeleton}
                classNames={isSkeleton ? ["w-1/4"] : undefined}
            />
        ),
        () => <Chip tone={chip.tone} icon={chip.icon} text={chip.text} isSkeleton={isSkeleton} />,
    ]

    // justify="between" pushes the timeago to the far edge — the PARENT does the
    // pushing, not a child margin; the label+chip stay grouped in their own inner track
    // so `between` only ever splits two things, not three.
    const attemptLineContent = [
        () => <StackH gap={3} principle="chip-row" align="center" isSkeleton={isSkeleton} items={attemptLabelAndChip} />,
        ...(isSkeleton || attempt?.processedTimeAgo != null ? [() => (
            <Typography
                text={attempt?.processedTimeAgo}
                size="xs"
                color="muted"
                isSkeleton={isSkeleton}
                classNames={isSkeleton ? ["w-1/4"] : undefined}
            />
        )] : []),
    ]

    const bylineContent = [
        () => (
            <InlineIconLabel
                icon={SparkleIcon}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                label={attempt?.gradedByModel != null ? `Graded by ${attempt.gradedByModel}` : undefined}
            />
        ),
        ...(isSkeleton || attempt?.modelCategory != null ? [() => (
            <EnumChip
                value={attempt?.modelCategory ?? ""}
                map={MODEL_CATEGORY_MAP}
                isSkeleton={isSkeleton}
            />
        )] : []),
    ]

    const rowContent = [
        () => (
            <StackH
                gap={3}
                principle="sibling-stack"
                align="center"
                justify="between"
                isSkeleton={isSkeleton}
                items={attemptLineContent}
            />
        ),
        ...(isSkeleton || attempt?.gradedByModel != null ? [() => (
            <StackH gap={3} principle="chip-row" align="center" at="sm" isSkeleton={isSkeleton} items={bylineContent} />
        )] : []),
    ]

    return <StackV gap={2} isSkeleton={isSkeleton} items={rowContent} />
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
    isSkeleton = false,
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

    const emptyContent: AsyncContentEmptyProps = { title: EMPTY_TITLE }
    const errorContent: AsyncContentErrorProps = { title: ERROR_TITLE, onRetry, retryLabel }

    const skeletonItems: Array<SurfaceCardListItem> = Array.from({ length: SKELETON_ATTEMPT_COUNT }, (_, index) => ({
        key: `skeleton-${index}`,
        content: () => attemptRowContent(undefined, true),
    }))

    // `selected` reads as a left accent band (`SurfaceCardListItem.tone`) — the
    // existing DATA-signal vocabulary every card frame already shares — instead
    // of a hand-rolled tint wrapper around the row's own content.
    const items: Array<SurfaceCardListItem> = pagedAttempts.map((attempt) => ({
        key: attempt.id,
        content: () => attemptRowContent(attempt, false),
        tone: attempt.id === selectedAttemptId ? "accent" : undefined,
        onPress: () => {
            onSelect(attempt.id)
            onOpenChange(false)
        },
    }))

    const listAndPager = [
        () => (
            <SurfaceCardList
                items={isSkeleton ? skeletonItems : items}
                isSkeleton={isSkeleton}
                error={error}
                errorState={() => <AsyncContentError {...errorContent} />}
                emptyState={() => <AsyncContentEmpty {...emptyContent} />}
            />
        ),
        ...(!isSkeleton && totalPages > 1 ? [() => (
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
            identity={{ tier: "overlay", component: "SubmissionAttemptsDrawer" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement={placement}
            title={`${DRAWER_TITLE} · ${attempts.length}`}
            body={() => <StackV gap={4} isSkeleton={isSkeleton} items={listAndPager} />}
        />
    )
}

export { _SubmissionAttemptsDrawer }
