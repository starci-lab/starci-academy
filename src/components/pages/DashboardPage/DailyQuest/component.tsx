"use client"

import React from "react"
import { CheckCircleIcon, CircleIcon } from "@phosphor-icons/react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import type { CallerIdentity } from "@/components/frames/_identity"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"

/** How many placeholder rows the co-located skeleton shows while the checklist is loading. */
const SKELETON_ROW_COUNT = 5

/** This block's own identity (BLOCK-2/split.md) — handed down to whichever root-capable frame renders as its root, per branch. See `_identity.ts`. */
const IDENTITY: CallerIdentity = { tier: "block", component: "DailyQuest" }

const DailyQuestClaimState = ({
    isSkeleton,
    claimed,
    allDone,
    isClaiming,
    onClaim,
    labels,
}: Pick<DailyQuestProps, "isSkeleton" | "claimed" | "allDone" | "isClaiming" | "onClaim" | "labels">) => (
    isSkeleton ? (
        <Typography isSkeleton size="xs" />
    ) : claimed ? (
        <Chip tone="success" text={labels.claimed} classNames={["self-start"]} />
    ) : allDone ? (
        <Button
            variant="primary"
            size="sm"
            classNames={["self-start"]}
            isPending={isClaiming}
            onPress={onClaim}
            label={labels.claim}
        />
    ) : (
        <Typography size="xs" color="muted" text={labels.completePrompt} />
    )
)

/** One resolved daily-quest task row, already localized by the connected `DailyQuest`. */
export interface DailyQuestTask {
    /** Stable row key — also names which task this is (mirrors BE `DailyQuestKey`). */
    key: string
    /** Already-translated task label, e.g. "Read a lesson". */
    title: string
    /** How many of the action the viewer has done today. */
    current: number
    /** How many are required today to complete this task. */
    target: number
}

/** All display text, already localized (and reward-count interpolated) by the connected `DailyQuest`. */
export interface DailyQuestLabels {
    /** Card header title, e.g. "Today's quest". */
    title: string
    /** Error-branch title. */
    loadError: string
    /** Error-branch retry button label. */
    retry: string
    /** "Reward claimed" chip label, shown once claimed. */
    claimed: string
    /** Claim button label — already interpolated with the reward count. */
    claim: string
    /** "Complete all N tasks to claim" prompt — already interpolated with the reward count. */
    completePrompt: string
}

/** Props for {@link _DailyQuest} — presentational; all data resolved, no fetch/store/i18n. */
export interface DailyQuestProps {
    /** First load, nothing in hand → the checklist (and the claim-state line below the card) shimmers in place. Owned by the connected file. */
    isSkeleton?: boolean
    /** Truthy → the error message (beats loading). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Today's reward already claimed. */
    claimed?: boolean
    /** Every required task has hit its target — enables the claim action. */
    allDone?: boolean
    /** Fires the claim mutation. */
    onClaim?: () => void
    /** True while the claim mutation is in flight — locks the claim button. */
    isClaiming?: boolean
    /** Today's checklist, in display order. */
    tasks?: Array<DailyQuestTask>
    labels: DailyQuestLabels
}

/**
 * "Today's quest" content — today's daily-quest checklist (read content · pass
 * challenge · review flashcards …), each row showing today's progress, plus a claim
 * action below the card that grants the reward once enough tasks are done. Content
 * only (the parent {@link import("@/components/blocks").LabeledCard} that this block
 * itself renders frames it) — the presentational half of `DailyQuest`. Two states in
 * the fixed order error → content (BLOCK-8): `error` falls to the shared
 * `AsyncContentError` frame (there is no genuine empty state — the quest set is
 * fixed, never a variable-length list that can be zero-length); otherwise the
 * checklist renders — while shimmering, `Skeleton.ListRow` placeholders keep the
 * SAME `LabeledCard` → `SurfaceListCard` shape so the box neither shrinks nor jumps
 * when data arrives (`SurfaceListCardRow` has no `isSkeleton` of its own, so the
 * mirror sits right here rather than in a parallel tree — loading-and-skeleton.md).
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link DailyQuestProps}
 */
export const _DailyQuest = ({
    isSkeleton = false,
    error,
    onRetry,
    claimed = false,
    allDone = false,
    onClaim,
    isClaiming = false,
    tasks = [],
    labels,
}: DailyQuestProps) => {
    if (error) {
        return <AsyncContentError title={labels.loadError} onRetry={onRetry} retryLabel={labels.retry} />
    }

    return (
        <LabeledCard
            identity={IDENTITY}
            label={labels.title}
            frameless
            description={() => (
                <DailyQuestClaimState
                    isSkeleton={isSkeleton}
                    claimed={claimed}
                    allDone={allDone}
                    isClaiming={isClaiming}
                    onClaim={onClaim}
                    labels={labels}
                />
            )}
        >
            <SurfaceListCard>
                {isSkeleton
                    ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => (
                        <Box key={index} principle="cell-pad" className="px-3"
                            explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.">
                            <Skeleton.ListRow withSubtitle={false} withTrailing />
                        </Box>
                    ))
                    : tasks.map((task) => {
                        const done = task.current >= task.target
                        return (
                            <SurfaceListCardRow
                                key={task.key}
                                leading={done ? () => (
                                    <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />
                                ) : () => (
                                    <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-foreground" />
                                )}
                                // `title` is plain text now (never a built element), so the done/todo
                                // colour — banned from `titleClassName` globally by lint
                                // `no-modal-title-classname` — rides on the leading icon alone
                                // (icon.md §6: icon+title shared colour by state, icon half of the pair).
                                title={task.title}
                                meta={() => <Typography size="xs" color="muted" text={`${task.current}/${task.target}`} />}
                            />
                        )
                    })}
            </SurfaceListCard>
        </LabeledCard>
    )
}
