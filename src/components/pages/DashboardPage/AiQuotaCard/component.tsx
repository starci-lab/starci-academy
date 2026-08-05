import React from "react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip, type ChipTone } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { AiSubTier } from "@/modules/api/graphql/queries/query-my-ai-settings"

/** How many placeholder credit-window rows the co-located skeleton shows (5h + weekly, always two). */
const WINDOW_ROW_COUNT = 2

/** Tier chip tone per paid tier. */
const TIER_CHIP_TONE: Record<AiSubTier, ChipTone> = {
    [AiSubTier.Plus]: "default",
    [AiSubTier.Pro]: "success",
    [AiSubTier.Max]: "warning",
}

/** One rolling credit window (5h or weekly), already resolved by the connected `AiQuotaCard`. */
export interface AiQuotaCardWindow {
    /** Stable row key. */
    key: string
    /** Already-translated window label ("Last 5 hours" / "This week"). */
    label: string
    /** Already-translated + interpolated "remaining/limit" readout. */
    creditsText: string
    /** Credits consumed in this window — the bar's fill value. */
    used: number
    /** Credit allowance in this window — the bar's max. */
    limit: number
}

/** All display text, already localized by the connected `AiQuotaCard`; a story passes i18n keys. */
export interface AiQuotaCardLabels {
    /** Card title ("AI credits"). */
    title: string
    /** Caption clarifying the two bars share one pool. */
    poolCaption: string
    /** Upgrade-CTA button label. */
    upgrade: string
    /** Error-branch title. */
    errorTitle: string
    /** Error-branch retry button label. */
    retry: string
}

/** Props for {@link _AiQuotaCard} — presentational; all data resolved, no fetch/store/i18n. */
export interface AiQuotaCardProps {
    /** First load, nothing in hand → the whole card shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no quota snapshot (signed out / fetch failed) → the card self-hides. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Active paid tier, or `undefined` on the free lane — drives the tier chip. */
    tier?: AiSubTier
    /** The two rolling windows (5h + weekly), each with its own bar. */
    windows?: Array<AiQuotaCardWindow>
    /** Fired when the "Upgrade plan" trigger is pressed. */
    onUpgradePress?: () => void
    labels: AiQuotaCardLabels
}

/**
 * Right-rail AI-credit mini card — the presentational half of {@link AiQuotaCard}. The single
 * credit pool (free base + tier) remaining in the current 5-hour and weekly windows, with a bar
 * per window, a tier chip when subscribed, and an upgrade CTA. Three states in the fixed order
 * error → loading → empty → content (BLOCK-8): a settled `error` falls to the shared
 * `AsyncContentError` frame; `isEmpty` self-hides entirely (no `emptyContent` — a secondary
 * widget, matches the sibling right-rail cards such as `StreakFreezeCard`/`UpcomingLivestreamCard`);
 * otherwise the title/caption/bars/CTA render in one tree with `isSkeleton` threaded to every leaf
 * so the shimmer mirrors the loaded shape (loading-and-skeleton.md). See `tiers/split.md` — the
 * connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link AiQuotaCardProps}
 */
export const _AiQuotaCard = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    tier,
    windows = [],
    onUpgradePress,
    labels,
}: AiQuotaCardProps) => {
    // error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag.
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return null
    }

    // ROWS — while shimmering, two placeholder rows keep the SAME `ProgressMeter` shape (5h +
    // weekly, always two — loading-and-skeleton.md §1: same row component, same count shape).
    const windowRows: Array<AiQuotaCardWindow> = isSkeleton
        ? Array.from({ length: WINDOW_ROW_COUNT }, (_unused, index) => ({ key: `pending-${index}`, label: "", creditsText: "", used: 0, limit: 1 }))
        : windows

    // tier chip renders optimistically while shimmering; once settled it only shows on a paid tier.
    const tierLabel = tier ? tier.toUpperCase() : undefined
    const showTierChip = isSkeleton || tierLabel !== undefined

    return (
        <StackV gap={3} isSkeleton={isSkeleton} identity={{ tier: "block", component: "AiQuotaCard" }} items={[
            () => (
                <StackH gap={3} justify="between" isSkeleton={isSkeleton} items={[
                    () => <Typography size="base" weight="semibold" text={labels.title} isSkeleton={isSkeleton} />,
                    ...(showTierChip ? [() => (
                        isSkeleton
                            ? <Chip isSkeleton />
                            : <Chip tone={tier ? TIER_CHIP_TONE[tier] : "default"} text={tierLabel ?? ""} />
                    )] : []),
                ]} />
            ),
            () => <Typography size="xs" color="muted" text={labels.poolCaption} isSkeleton={isSkeleton} />,
            ...windowRows.map((window) => () => (
                isSkeleton
                    ? (
                        <ProgressMeter
                            isSkeleton
                            leading={() => <Typography size="xs" color="muted" isSkeleton text={window.label} />}
                            trailing={() => <Typography size="xs" weight="medium" isSkeleton text={window.creditsText} />}
                        />
                    )
                    : (
                        <ProgressMeter
                            value={window.used}
                            max={window.limit || 1}
                            color="accent"
                            leading={() => <Typography size="xs" color="muted" text={window.label} />}
                            trailing={() => <Typography size="xs" weight="medium" text={window.creditsText} />}
                        />
                    )
            )),
            () => (isSkeleton
                ? <Button isSkeleton variant="tertiary" size="sm" />
                : <Button variant="tertiary" size="sm" label={labels.upgrade} onPress={onUpgradePress} />),
        ]} />
    )
}
