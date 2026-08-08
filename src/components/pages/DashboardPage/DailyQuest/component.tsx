"use client"

import React from "react"
import {
    CheckCircleIcon,
    CircleIcon,
} from "@phosphor-icons/react"
import {
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import type {
    CallerIdentity,
} from "@/components/frames/_identity"
import type {
    SkeletonProps,
} from "@/components/frames/_slot"
import {
    SurfaceCardList,
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"
import {
    Button,
} from "@/components/atoms/buttons/Button"
import {
    Chip,
} from "@/components/atoms/chips/Chip"
import {
    Typography,
} from "@/components/atoms/text/Typography"

/** How many placeholder rows the co-located skeleton shows while the checklist is loading. */
const SKELETON_ROW_COUNT = 5

/** This block's own identity (BLOCK-2/split.md) — handed to SurfaceCardList as its root. */
const IDENTITY: CallerIdentity = {
    tier: "block",
    component: "DailyQuest",
}

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
        <Chip tone="success" text={labels.claimed} classNames={[
            "self-start",
        ]} />
    ) : allDone ? (
        <Button
            variant="primary"
            size="sm"
            classNames={[
                "self-start",
            ]}
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
    /** First load, nothing in hand → the checklist (and the claim-state line) shimmers in place. Owned by the connected file. */
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
 * "Today's quest" checklist — class C collapse: one {@link SurfaceCardList} owns
 * label / identity / isSkeleton / rows / error (B37). Claim / prompt UI moves from
 * the former LabeledCard `description` slot into SurfaceCard `action` (ComponentType
 * door; description stays a string caption).
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
    const skeletonItems: Array<SurfaceCardListItem> = Array.from(
        {
            length: SKELETON_ROW_COUNT,
        },
        (_unused, index) => ({
            key: `skeleton-${index}`,
            title: "Loading",
            leadingIcon: CircleIcon,
        }),
    )

    const taskItems: Array<SurfaceCardListItem> = tasks.map((task) => {
        const done = task.current >= task.target
        return {
            key: task.key,
            leading: done
                ? () => (
                    <CheckCircleIcon
                        aria-hidden
                        focusable="false"
                        className="size-5 shrink-0 text-success-soft-foreground"
                    />
                )
                : () => (
                    <CircleIcon
                        aria-hidden
                        focusable="false"
                        className="size-5 shrink-0 text-foreground"
                    />
                ),
            title: task.title,
            meta: () => (
                <Typography size="xs" color="muted" text={`${task.current}/${task.target}`} />
            ),
        }
    })

    return (
        <SurfaceCardList
            identity={IDENTITY}
            label={labels.title}
            action={({
                isSkeleton: slotSkeleton,
            }: SkeletonProps) => (
                <DailyQuestClaimState
                    isSkeleton={slotSkeleton ?? isSkeleton}
                    claimed={claimed}
                    allDone={allDone}
                    isClaiming={isClaiming}
                    onClaim={onClaim}
                    labels={labels}
                />
            )}
            items={isSkeleton ? skeletonItems : taskItems}
            isSkeleton={isSkeleton}
            error={error}
            errorState={() => (
                <AsyncContentError
                    title={labels.loadError}
                    onRetry={onRetry}
                    retryLabel={labels.retry}
                />
            )}
        />
    )
}
