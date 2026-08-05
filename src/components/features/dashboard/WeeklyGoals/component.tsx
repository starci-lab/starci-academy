import React from "react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { StatGridCard, type StatGridCardItem } from "@/components/blocks/stats/StatGridCard"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { KPI_ICON_MAP } from "./map"
import type { KpiKey } from "@/modules/api/graphql/queries/types/my-kpis"

/** One weekly-metric row, already resolved by the connected {@link import("./index").WeeklyGoals}. */
export interface WeeklyGoalsItem {
    /** Which weekly metric this row is. */
    key: KpiKey
    /** Already-localized metric label. */
    label: string
    /** This week's value so far. */
    current: number
    /** Effective target — the learner's custom goal, or the sensible default. */
    target: number
    /** Already-localized coin-reward hint; omitted when no target is set server-side. */
    coinRewardText?: string
    /** `true` → this metric's reward can be claimed right now. */
    canClaim: boolean
}

/** All display text, already localized by the connected `WeeklyGoals`; a story passes i18n keys. */
export interface WeeklyGoalsLabels {
    /** Title on the error branch. */
    errorTitle: string
    /** Retry-button label, paired with `onRetry`. */
    retry: string
}

/** Props for {@link _WeeklyGoals} — presentational; all data resolved, no fetch/store/i18n. */
export interface WeeklyGoalsProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Truthy → the error message (beats a stale loading flag). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler, paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** All six weekly metrics, in display order. No empty state — this is always the fixed six-metric set. */
    items: Array<WeeklyGoalsItem>
    /** The composite summary sentence (percent/completed/total, plus the reset countdown when known), already interpolated. */
    summaryText?: string
    labels: WeeklyGoalsLabels
}

/**
 * One metric cell's content: a `ProgressMeter` carrying the icon+label / ratio row in its own
 * `leading`/`trailing` slots (same idiom as the sibling `AiQuotaCard` block), then an optional
 * coin-reward hint below it.
 */
const renderGoalCell = (item: WeeklyGoalsItem, isSkeleton: boolean) => (
    <StackV gap={3} isSkeleton={isSkeleton} items={[
        // ATOM GAP: `ProgressMeter`'s discriminated `isSkeleton` union needs a literal branch
        // to narrow at compile time — a runtime boolean can't satisfy it directly.
        () => (isSkeleton
            ? (
                <ProgressMeter
                    isSkeleton
                    leading={() => <Typography size="sm" prefixIcon={KPI_ICON_MAP[item.key]} isSkeleton text={item.label} />}
                    trailing={() => <Typography size="xs" color="muted" tabularNums isSkeleton text={`${item.current}/${item.target}`} />}
                />
            )
            : (
                <ProgressMeter
                    value={item.current}
                    max={item.target > 0 ? item.target : 1}
                    color="accent"
                    leading={() => <Typography size="sm" prefixIcon={KPI_ICON_MAP[item.key]} text={item.label} />}
                    trailing={() => <Typography size="xs" color="muted" tabularNums text={`${item.current}/${item.target}`} />}
                />
            )),
        // coin-reward hint — only once a REAL target is set server-side, and never while
        // shimmering (unknown yet whether this row will show one — same as the loaded shape
        // it mirrors, `WeeklyGoalsProps.items` never carries a reward while `isSkeleton`).
        ...(!isSkeleton && item.coinRewardText ? [() => (
            <Typography
                size="xs"
                color={item.canClaim ? "accent-soft" : "muted"}
                text={item.coinRewardText}
            />
        )] : []),
    ]} />
)

/**
 * "Weekly goals" content — the presentational half of {@link import("./index").WeeklyGoals}: the
 * composite weekly-goal summary + a per-metric breakdown (lessons / study-days / challenges /
 * coding / flashcards / milestones), each with a progress meter against its effective target.
 * Content only — the caller's `LabeledCard` frames it.
 *
 * `error` beats a stale loading flag (BLOCK-8): it falls to the shared `AsyncContentError` frame,
 * otherwise the fixed six-metric tree renders with `isSkeleton` threaded to every leaf so the
 * shimmer mirrors the loaded shape (loading-and-skeleton.md). No `isEmpty` state — `items` is
 * always the fixed six-metric set, so there is nothing to be empty. See `tiers/split.md` — the
 * connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link WeeklyGoalsProps}
 */
export const _WeeklyGoals = ({
    isSkeleton = false,
    error,
    onRetry,
    items,
    summaryText,
    labels,
}: WeeklyGoalsProps) => {
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }

    const gridItems: Array<StatGridCardItem> = items.map((item) => ({
        key: item.key,
        content: renderGoalCell(item, isSkeleton),
    }))

    return (
        <StackV gap={3} isSkeleton={isSkeleton} identity={{ tier: "block", component: "WeeklyGoals" }} items={[
            () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={summaryText} />,
            () => <StatGridCard items={gridItems} />,
        ]} />
    )
}
