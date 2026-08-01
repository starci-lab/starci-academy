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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `WeeklyGoals`: "Weekly Goals" — the composite weekly-goal summary
 * plus the fixed six-metric breakdown (lessons / study-days / challenges /
 * coding / flashcards / milestones), each with a bar once it has an effective
 * target, plus an optional coin-reward hint.
 *
 * GROUND TRUTH: `src`'s `components/features/dashboard/WeeklyGoals/index.tsx`,
 * backed by the real `myKpis` query (`QueryMyKpisData`: `items[]` + the
 * server-computed `composite` + `resetAt`).
 *
 * COMPOSED, NOT REBUILT: the six-cell grid is `StatGridCard` — "MULTIPLE cells,
 * each more complex than a number-label pair (icon + meter + multiple lines)"
 * is that composite's own matrix entry (`node scripts/matrix.mjs "MULTIPLE
 * cells, each more complex than a number-label pair"`) — nothing here hand-rolls
 * a grid. Each bar is `ProgressMeter` ("ONE ratio over ONE total"). The card
 * face is `SurfaceCard` (labeled variant), same as every sibling dashboard
 * block in this pass.
 *
 * ⭐ SIX CELLS, ALWAYS. `items` is the FULL, FIXED KPI set — the real query
 * always returns all six keys, and the effective target (custom-or-default)
 * means every cell has something to show from the first paint. So there is no
 * `isEmpty` branch here (§14d.3: building a case no screen asks for) — only
 * loading / error / content are real states for this block.
 *
 * ⭐ THE COMPOSITE FIELD IS REAL DATA, NOT RECOMPUTED. `QueryMyKpisData.composite`
 * (percent/completed/total) already comes off the server — this block reads it
 * straight instead of re-deriving it from `items` a second time (two sources of
 * truth for the same number is exactly the trap `.artifacts/domain` warns about).
 *
 * ⭐ THE RESET COUNTDOWN ARRIVES PRE-WORDED (§14d.1 — same boundary as
 * `ChallengeDeliverableItem.processedAt`): this block does not own date/locale
 * math, so `resetInLabel` is a caller-built string ("3 days 12 hours left"),
 * omitted while unknown instead of a raw `resetAt` ISO timestamp for this block
 * to parse.
 *
 * ⭐ THE SUMMARY SENTENCE AND THE RATIO/REWARD LINES ARE BLOCK WORDING, NOT
 * CALLER STRINGS (same convention as `LeaderboardBoard`'s "Rank #N"): `percent`
 * / `completed` / `total` / `current` / `target` / `coinReward` are typed
 * numbers, and the Vietnamese sentence around them is built HERE, once, so
 * every screen embedding this block reads the identical wording.
 *
 * ⭐ `label` PER ITEM IS A CALLER STRING, THE ICON IS NOT. The metric NAME
 * ("Lessons", "Study days"…) is screen copy the block never owns (it never calls
 * `useTranslations` itself, same rule `ProgressMeter.label` documents); the
 * icon-per-key mapping is a pure display constant, kept local exactly like
 * `ChallengeDeliverableList`'s own `STATUS_MARK` table.
 *
 * ⭐ `ProgressMeter` HAS NO USABLE `isSkeleton` HERE — same known gap
 * `ChallengeScoreCard`/`MockInterviewScorecard` already document (its own
 * discriminated union can't narrow against a plain `boolean`). While skeleton,
 * this block substitutes a bar-shaped `HeroSkeleton` sized to the meter's own
 * track height instead — same position in the tree, so nothing jumps when the
 * real ratio lands.
 *
 * ⛔ NO `isPending` STATE. This block is a read-only weekly snapshot — claiming
 * a KPI's coin reward happens in the `/kpi` editor, not here, so there is no
 * user action in this tree to be pending on.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy: boolean,
) => {
    const Icon = KPI_ICON[item.key]
    const effectiveTarget = item.target ?? defaultTargets[item.key]

    const iconLabel = (
        <StackH gap={2} anatPart={showAnatomy ? "StackH" : undefined} body={(
            <>
                {isSkeleton ? (
                    <HeroSkeleton
                        className="size-5 shrink-0 rounded-full"
                        data-anat-part={showAnatomy ? "Skeleton" : undefined}
                    />
                ) : (
                    <Icon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                )}
                <Typography
                    size="sm"
                    isSkeleton={isSkeleton}
                    text={item.label}
                    showAnatomy={showAnatomy}
                />
            </>
        )} />
    )

    const labelRow = (
        <StackH gap={3} justify="between" anatPart={showAnatomy ? "StackH" : undefined} body={(
            <>
                {iconLabel}
                <Typography
                    size="xs"
                    color="muted"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : `${item.current}/${effectiveTarget}`}
                    showAnatomy={showAnatomy}
                />
            </>
        )} />
    )

    return (
        <StackV gap={3} anatPart={showAnatomy ? "StackV" : undefined} body={(
            <>
                {labelRow}
                {isSkeleton ? (
                    <HeroSkeleton
                        className="h-1 w-full rounded-full"
                        data-anat-part={showAnatomy ? "Skeleton" : undefined}
                    />
                ) : (
                    <ProgressMeter
                        value={item.current}
                        max={effectiveTarget > 0 ? effectiveTarget : 1}
                        anatPart={showAnatomy ? "ProgressMeter" : undefined}
                    />
                )}
                {!isSkeleton && item.coinReward != null ? (
                    <Typography
                        size="xs"
                        color={item.canClaim ? "accent" : "muted"}
                        text={`+${item.coinReward} coins when met`}
                        showAnatomy={showAnatomy}
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
    showAnatomy: boolean
}

const Content = ({ items, composite, resetInLabel, defaultTargets, isSkeleton, showAnatomy }: ContentProps) => {
    const summary = isSkeleton
        ? undefined
        : `${composite.percent}% complete (${composite.completed}/${composite.total} goals)${resetInLabel != null ? ` · ${resetInLabel}` : ""}`
    const gridItems: Array<StatGridCardItem> = items.map((item) => ({
        key: item.key,
        content: goalCellContent(item, defaultTargets, isSkeleton, showAnatomy),
    }))
    return (
        <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={(
            <>
                <Typography
                    size="sm"
                    weight="medium"
                    isSkeleton={isSkeleton}
                    text={summary}
                    showAnatomy={showAnatomy}
                />
                <div data-anat-part={showAnatomy ? "StatGridCard" : undefined}>
                    <StatGridCard items={gridItems} showAnatomy={showAnatomy} />
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
    showAnatomy = false,
    anatPart,
}: WeeklyGoalsProps) => (
    <SurfaceCard
        label="Weekly Goals"
        anatPart={anatPart}
        showAnatomy={showAnatomy}
        body={() => (
            <AsyncContent
                isLoading={isLoading}
                skeleton={(
                    <Content
                        items={loadingItems(defaultTargets)}
                        composite={{ percent: 0, completed: 0, total: 6 }}
                        defaultTargets={defaultTargets}
                        isSkeleton
                        showAnatomy={showAnatomy}
                    />
                )}
                error={error}
                errorContent={{
                    title: "Couldn't load weekly goals",
                    description: "Retry to see the latest progress.",
                    onRetry,
                    retryLabel: "Retry",
                }}
                showAnatomy={showAnatomy}
            >
                {data ? (
                    <Content
                        items={data.items}
                        composite={data.composite}
                        resetInLabel={data.resetInLabel}
                        defaultTargets={defaultTargets}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                ) : null}
            </AsyncContent>
        )}
    />
)

export { WeeklyGoals }
