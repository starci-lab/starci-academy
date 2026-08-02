import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import {
    BookOpenIcon,
    CardsIcon,
    CodeIcon,
    FlagIcon,
    FlameIcon,
    PuzzlePieceIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StatGridCard, type StatGridCardItem } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `WeeklyGoals` — a BLOCK (dashboard): "Weekly Goals" — the composite weekly-goal
 * summary plus the fixed six-metric breakdown (lessons / study-days / challenges /
 * coding / flashcards / milestones), each with a bar once it has an effective
 * target, plus an optional coin-reward hint.
 *
 * Backed by a `QueryMyKpisData` shape (`items[]` + server-computed `composite` +
 * `resetAt`). Composed: the six-cell grid is `StatGridCard`, each bar is
 * `ProgressMeter`, the card face is `SurfaceCard` (labeled).
 *
 * `items` is the full, fixed six-KPI set and every cell always has something to
 * show, so there is no `isEmpty` branch — only loading / error / content. The
 * `composite` field is read straight from the server, not re-derived from `items`.
 * `resetInLabel` is a caller-built string (no date math here). The summary sentence
 * and ratio/reward lines are block wording around typed numbers; each item's
 * `label` is a caller string but the icon-per-key mapping is a local constant.
 *
 * `ProgressMeter` has no usable `isSkeleton`; while skeleton this block substitutes
 * a bar-shaped `HeroSkeleton` sized to the meter's track height. No `isPending`
 * state — this is a read-only snapshot; claiming happens in the `/kpi` editor.
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
        <StackH gap={2} body={(
            <>
                {isSkeleton ? (
                    <HeroSkeleton
                        className="size-5 shrink-0 rounded-full"

                    />
                ) : (
                    <Icon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                )}
                <Typography
                    size="sm"
                    isSkeleton={isSkeleton}
                    text={item.label}

                />
            </>
        )} />
    )

    const labelRow = (
        <StackH gap={3} justify="between" body={(
            <>
                {iconLabel}
                <Typography
                    size="xs"
                    color="muted"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : `${item.current}/${effectiveTarget}`}

                />
            </>
        )} />
    )

    return (
        <StackV gap={3} body={(
            <>
                {labelRow}
                {isSkeleton ? (
                    <HeroSkeleton
                        className="h-1 w-full rounded-full"

                    />
                ) : (
                    <ProgressMeter
                        value={item.current}
                        max={effectiveTarget > 0 ? effectiveTarget : 1}

                    />
                )}
                {!isSkeleton && item.coinReward != null ? (
                    <Typography
                        size="xs"
                        color={item.canClaim ? "accent" : "muted"}
                        text={`+${item.coinReward} coins when met`}

                    />
                ) : null}
            </>
        )} />
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
        content: goalCellContent(item, defaultTargets, isSkeleton),
    }))
    return (
        <StackV gap={4} body={(
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    isSkeleton={isSkeleton}
                    text={summary}

                />
                <div>
                    <StatGridCard items={gridItems} />
                </div>
            </>
        )} />
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
                skeleton={(
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
                content={data ? (
                    <Content
                        items={data.items}
                        composite={data.composite}
                        resetInLabel={data.resetInLabel}
                        defaultTargets={defaultTargets}
                        isSkeleton={isSkeleton}

                    />
                ) : null}
            />
        )}
    />
)

export { WeeklyGoals }
