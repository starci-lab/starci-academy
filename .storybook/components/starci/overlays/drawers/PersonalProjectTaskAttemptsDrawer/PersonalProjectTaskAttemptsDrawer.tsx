import React from "react"
import { ClockIcon, SparkleIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PersonalProjectTaskAttemptsDrawer`: the AI-review history for ONE
 * personal-project milestone task — every attempt the learner has submitted for
 * THIS task, each with its score, a line of grader feedback, and when it was
 * processed.
 *
 * Filed under `overlays/drawers/` (kind: overlay-drawer per Rule 13), matching
 * its siblings `E2eResultDrawer` and `SubmissionAttemptsDrawer` — corrected
 * from an earlier pass that filed it under `blocks/learn/` instead.
 *
 * ⭐ REUSE-FIRST CHECK (this run's mandated read). Composed entirely from
 * existing tier-3-and-below pieces, nothing hand-rolled past them: `DrawerShell`
 * (scaffold — CloseTrigger+Header+Body, per Rule 13, mirroring the ported
 * `E2eResultDrawer`), `AsyncContent` (the one loading/empty/error/content
 * switch), `SurfaceCardList` in its FREE-FORM row shape (`item.content` —
 * documented alongside the fixed row shape, story
 * `composites-cards-surfacecard-surfacecardlist--free-form`), `Chip` +
 * `InlineIconLabel` atoms/composites already used for this exact "sparkle +
 * score" and "muted icon + label" idiom in `SubmissionScoreCard` and
 * `TaskSubmissionPanel`'s `TaskResultSummary`.
 *
 * WHY FREE-FORM, NOT `SurfaceCardList`'s fixed row. The fixed row shape only
 * offers `title`+`subtitle` (two lines) plus one `meta`/`trailing` slot — this
 * row needs FOUR pieces stacked (attempt label + score chip on one line, then a
 * feedback line, then a clock+time line), which is a different DOM shape, not a
 * data difference the fixed row's slots can carry. Free-form still gets the
 * shared list face/row-box/divider from `SurfaceCardList` for free — only the
 * inner content is bespoke.
 *
 * ⭐ ONE LEAF, `AttemptRow` (§11f), CO-LOCATED SKELETON (§6b/rule 6). Loading /
 * empty / error / populated are branches of the SAME `AttemptRow` tree wearing
 * different content, never a second parallel shape — so the skeleton mirror
 * passed to `AsyncContent` is built from the exact same `AttemptRow` component
 * with `isSkeleton` flipped, not a hand-drawn placeholder that can drift from
 * the real row the next time this block's layout changes.
 *
 * ⭐ SIMPLER THAN ITS CHALLENGE-SIDE SIBLING `SubmissionAttemptsDrawer`, ON
 * PURPOSE (confirmed against
 * `starci-academy-backend/.claude/fe/steps/11-overlays-layouts-brainstorm.md`
 * §3 before this build): no pagination (a milestone task's attempt count is
 * small — one drawer's worth), no footer action row (nothing to do here besides
 * read the history; re-attempting happens from the task panel this drawer opens
 * off of, not from inside the drawer itself).
 *
 * ⭐ SCORE `null` IS A REAL STATE, NOT A LOADING STUB (§2) — an attempt that has
 * been submitted but not yet graded (e.g. the AI review job is still running).
 * The row shows "Đang chấm" in a neutral chip instead of a number, same idiom as
 * `TaskSubmissionPanel`'s "chưa có lần chấm điểm nào" — a named absence, never a
 * blank/undefined render.
 *
 * ⛔ OVERLAY, PRESENTATIONAL ONLY (Rule 13). `isOpen`/`onOpenChange` forward
 * straight to `DrawerShell`; which task's attempts these are, and when the
 * drawer opens, is app wiring (`useOverlayStore` + a real fetch hook) that lives
 * outside this block, same discipline as every other port in this pass.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One AI-graded attempt at a personal-project milestone task. */
export interface PersonalProjectTaskAttempt {
    /** Stable id — the row's React key. */
    id: string
    /** 1-based order the attempt was made in — the block turns this into "Lần N". */
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
    /** `true` (once loading has finished) → the list falls to its empty message. */
    isEmpty?: boolean
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Extra classes merged onto the drawer's dialog surface. */
    className?: string
}

/** Fixed, block-owned title — this drawer's whole reason to exist is this one list. */
const DRAWER_TITLE = "Lịch sử các lần chấm AI"

const EMPTY_LABEL_DEFAULT = "Chưa có lần nộp nào cho nhiệm vụ này."
const ERROR_TITLE = "Không tải được lịch sử chấm AI"

/** How many skeleton rows mirror the list while `attempts` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Props for the local {@link AttemptRow} leaf. */
interface AttemptRowProps {
    /** The attempt's data. Omitted only in the skeleton branch. */
    attempt?: PersonalProjectTaskAttempt
    /** Resting state — the row keeps its shape, only the text shimmers. */
    isSkeleton?: boolean
    /** `true` → each part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * ONE attempt row: attempt-number label + sparkle/score chip on one line, an
 * optional feedback line, and a clock + processed-time line. The SAME shape
 * renders for real data and for the skeleton mirror (`isSkeleton` flips which
 * parts shimmer) — no second, hand-drawn placeholder tree (§6b).
 */
const AttemptRow = ({ attempt, isSkeleton = false, showAnatomy = false }: AttemptRowProps) => {
    const scoreTone: ChipTone = attempt?.score != null ? "accent" : "default"
    const scoreLabel = attempt?.score != null ? `${attempt.score} điểm` : "Đang chấm"
    // A missing attempt (real, §2) drops the line; the skeleton branch always
    // reserves it so the mirror's footprint matches a typical populated row.
    const showFeedback = isSkeleton || attempt?.shortFeedback != null

    const attemptLabelAndChip = (
        <>
            <Typography
                size="sm"
                weight="medium"
                isSkeleton={isSkeleton}
                classNames={isSkeleton ? ["w-1/4"] : undefined}
                text={attempt != null ? `Lần ${attempt.attemptNumber}` : undefined}
                anatPart={showAnatomy ? "Typography (attempt label)" : undefined}
            />
            <Chip
                icon={SparkleIcon}
                tone={scoreTone}
                isSkeleton={isSkeleton}
                text={scoreLabel}
                anatPart={showAnatomy ? "Chip" : undefined}
            />
        </>
    )

    const rowLines = (
        <>
            <StackH
                gap="grouped"
                align="center"
                justify="between"
                wrap
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "StackH (attempt)" : undefined}
                body={attemptLabelAndChip}
            />
            {showFeedback ? (
                <Typography
                    size="sm"
                    color="muted"
                    isSkeleton={isSkeleton}
                    classNames={isSkeleton ? ["w-2/3"] : undefined}
                    text={attempt?.shortFeedback ?? undefined}
                    anatPart={showAnatomy ? "Typography (feedback)" : undefined}
                />
            ) : null}
            <InlineIconLabel
                icon={<ClockIcon aria-hidden focusable="false" />}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "InlineIconLabel" : undefined}
            >
                {attempt?.processedAtLabel ?? ""}
            </InlineIconLabel>
        </>
    )

    return (
        <StackV gap="tight" showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackV" : undefined} body={rowLines} />
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
    isEmpty = false,
    emptyLabel,
    error,
    onRetry,
    retryLabel,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
}: PersonalProjectTaskAttemptsDrawerProps) => {
    const emptyContent: AsyncContentEmptyProps = {
        title: emptyLabel ?? EMPTY_LABEL_DEFAULT,
        anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
        showAnatomy,
    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel,
        anatPart: showAnatomy ? "AsyncContentError" : undefined,
        showAnatomy,
    }

    const skeletonItems: Array<SurfaceCardListItem> = Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => ({
        key: `skeleton-${index}`,
        content: <AttemptRow isSkeleton showAnatomy={showAnatomy} />,
    }))

    const items: Array<SurfaceCardListItem> = attempts.map((attempt) => ({
        key: attempt.id,
        content: <AttemptRow attempt={attempt} showAnatomy={showAnatomy} />,
    }))

    return (
        <div data-anat-part={anatPart}>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement={placement}
                title={DRAWER_TITLE}
                className={className}
                showAnatomy={showAnatomy}
            >
                <AsyncContent
                    // A parent-forced skeleton and this drawer's own in-flight fetch share
                    // the one loading branch `AsyncContent` exposes (see file header).
                    isLoading={isLoading || isSkeleton}
                    skeleton={
                        <SurfaceCardList
                            items={skeletonItems}
                            showAnatomy={showAnatomy}
                            anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                        />
                    }
                    isEmpty={isEmpty}
                    emptyContent={emptyContent}
                    error={error}
                    errorContent={errorContent}
                    showAnatomy={showAnatomy}
                    content={
                        <SurfaceCardList
                            items={items}
                            showAnatomy={showAnatomy}
                            anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                        />
                    }
                />
            </DrawerShell>
        </div>
    )
}

export { PersonalProjectTaskAttemptsDrawer }
