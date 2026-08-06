import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import {
    BookOpenIcon,
    CardsIcon,
    CodeIcon,
    FlagIcon,
    FlameIcon,
    PuzzlePieceIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StatGridCard, type StatGridCardItem } from "@/components/composites/stats/StatGridCard"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * BLOCK — `WeeklyGoals`: "Weekly Goals" — the composite summary + six-metric
 * breakdown. See the component's own file header for the full contract; this
 * file only adds the states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): the six metrics never change the SHAPE of the
 * tree, only the numbers inside it, so this block has exactly ONE leaf
 * ("Content") — loading / error / content are states of that one leaf, the
 * same shape `ChallengeScoreCard`'s single leaf uses. No `isEmpty` state:
 * `items` is always the fixed six-metric set (see the component file header).
 */

/** The six weekly metrics this block always renders, in display order (mirrors backend `KpiKey`). */
export type WeeklyGoalKey = "lessons" | "studyDays" | "challenges" | "coding" | "flashcards" | "milestones"

/** One weekly-goal metric: current-week value vs the effective target, plus its coin reward. */
export interface WeeklyGoalItem {
    /** Which metric this row is. */
    key: WeeklyGoalKey
    /** Already-localized metric name (e.g. "Lessons") — screen copy, not owned by this block. */
    label: string
    /** The current-week value. */
    current: number
    /** The learner's custom weekly target; `null` when none set (the block falls back to a sensible default). */
    target: number | null
    /** Coin reward for claiming this metric this week; `null` when no target is set server-side. */
    coinReward: number | null
    /** `true` → this metric's reward can be claimed right now (met + not yet claimed). */
    canClaim: boolean
}

/** The viewer's weekly-goals snapshot (real shape of `myKpis`). */
export interface WeeklyGoalsData {
    /** All six metrics, in display order. */
    items: Array<WeeklyGoalItem>
    /** Server-computed composite score across every metric — read straight, never recomputed. */
    composite: {
        /** Average completion across the six metrics, 0–100. */
        percent: number
        /** Number of metrics already met (current >= effective target). */
        completed: number
        /** Always 6 — the fixed metric count. */
        total: number
    }
    /** Already-worded countdown to the weekly reset (e.g. "3 days 12 hours left"). Omit while unknown. */
    resetInLabel?: string
}

/** Props for {@link WeeklyGoals}. */
export interface WeeklyGoalsProps {
    /** True while the first load is running — {@link AsyncContent}'s loading branch. */
    isLoading: boolean
    /** Truthy → the snapshot failed to load. Pass SWR's `error`. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry: () => void
    /** The viewer's weekly-goals snapshot. Required once loaded (no error). */
    data?: WeeklyGoalsData
    /** Sensible default target per metric, used when a metric has no custom `target` set yet. */
    defaultTargets: Record<WeeklyGoalKey, number>
    /** `true` → every atom this block owns switches to its own shimmer (data already loaded). */
    isSkeleton?: boolean
}

/** Phosphor icon per metric key — a pure display constant, decoupled from any editor's own map. */
const KPI_ICON: Record<WeeklyGoalKey, PhosphorIcon> = {
    lessons: BookOpenIcon,
    studyDays: FlameIcon,
    challenges: PuzzlePieceIcon,
    coding: CodeIcon,
    flashcards: CardsIcon,
    milestones: FlagIcon,
}

/** One metric cell's content: icon + label + ratio row, then the meter, then an optional coin hint. */
const goalCellContent = (
    item: WeeklyGoalItem,
    defaultTargets: Record<WeeklyGoalKey, number>,
    isSkeleton: boolean,
) => {
    const Icon = KPI_ICON[item.key]
    const effectiveTarget = item.target ?? defaultTargets[item.key]

    const iconLabel = (
        <StackH gap={2} isSkeleton={isSkeleton} items={[
            () => (isSkeleton ? (
                <Skeleton
                    className="size-5 shrink-0 rounded-full"

                />
            ) : (
                <Icon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
            )),
            () => (
                <Typography
                    size="sm"
                    isSkeleton={isSkeleton}
                    text={item.label}

                />
            ),
        ]} />
    )

    const labelRow = (
        <StackH gap={3} principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            justify="between" isSkeleton={isSkeleton} items={[
                () => iconLabel,
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        tabularNums
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : `${item.current}/${effectiveTarget}`}

                    />
                ),
            ]} />
    )

    return (
        <StackV identity={{ tier: "block", component: "WeeklyGoals" }} gap={3} isSkeleton={isSkeleton} items={[
            () => labelRow,
            () => (
                <ProgressMeter
                    value={item.current}
                    max={effectiveTarget > 0 ? effectiveTarget : 1}
                    isSkeleton={isSkeleton}
                />
            ),
            ...(!isSkeleton && item.coinReward != null ? [() => (
                <Typography
                    size="xs"
                    color={item.canClaim ? "accent" : "muted"}
                    isSkeleton={isSkeleton}
                    text={`+${item.coinReward} coins when met`}

                />
            )] : []),
        ]} />
    )
}

/** Fixed-shape placeholder rendered while {@link WeeklyGoalsProps.isLoading} — six empty cells, no real data yet. */
const loadingItems = (defaultTargets: Record<WeeklyGoalKey, number>): Array<WeeklyGoalItem> =>
    (Object.keys(defaultTargets) as Array<WeeklyGoalKey>).map((key) => ({
        key,
        label: "",
        current: 0,
        target: null,
        coinReward: null,
        canClaim: false,
    }))

/** Props for the internal {@link Content} tree — reused for both the real render and the loading skeleton. */
interface ContentProps {
    items: Array<WeeklyGoalItem>
    composite: WeeklyGoalsData["composite"]
    resetInLabel?: string
    defaultTargets: Record<WeeklyGoalKey, number>
    isSkeleton: boolean
}

const Content = ({ items, composite, resetInLabel, defaultTargets, isSkeleton }: ContentProps) => {
    const summary = isSkeleton
        ? undefined
        : `${composite.percent}% complete (${composite.completed}/${composite.total} goals)${resetInLabel != null ? ` · ${resetInLabel}` : ""}`
    const gridItems: Array<StatGridCardItem> = items.map((item) => ({
        key: item.key,
        content: () => goalCellContent(item, defaultTargets, isSkeleton),
    }))
    return (
        <StackV identity={{ tier: "block", component: "WeeklyGoals" }} gap={4} isSkeleton={isSkeleton} items={[
            () => (
                <Typography
                    size="sm"
                    weight="medium"
                    isSkeleton={isSkeleton}
                    text={summary}

                />
            ),
            () => (
                <div>
                    <StatGridCard items={gridItems} />
                </div>
            ),
        ]} />
    )
}

/**
 * "Weekly Goals" — the weekly-goal summary + six-metric breakdown. See the
 * file header for the full contract.
 *
 * @param props - {@link WeeklyGoalsProps}
 */
const WeeklyGoals = ({
    isLoading,
    error,
    onRetry,
    data,
    defaultTargets,
    isSkeleton = false,
}: WeeklyGoalsProps) => (
    <SurfaceCard
        label="Weekly Goals"


        body={() => (
            <AsyncContent
                isLoading={isLoading}
                skeleton={() => (
                    <Content
                        items={loadingItems(defaultTargets)}
                        composite={{ percent: 0, completed: 0, total: 6 }}
                        defaultTargets={defaultTargets}
                        isSkeleton

                    />
                )}
                error={error}
                errorContent={{
                    title: "Couldn't load weekly goals",
                    description: "Retry to see the latest progress.",
                    onRetry,
                    retryLabel: "Retry",
                }}
                content={() => (data ? (
                    <Content
                        items={data.items}
                        composite={data.composite}
                        resetInLabel={data.resetInLabel}
                        defaultTargets={defaultTargets}
                        isSkeleton={isSkeleton}

                    />
                ) : null)}
            />
        )}
    />
)

export { WeeklyGoals }
