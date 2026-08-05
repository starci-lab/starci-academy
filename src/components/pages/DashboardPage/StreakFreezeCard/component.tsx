import React from "react"
import {
    SnowflakeIcon,
} from "@phosphor-icons/react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"

/** Maximum number of streak freezes a user may own. */
export const MAX_FREEZES = 3

/** Points cost of one streak freeze. */
export const FREEZE_COST = 100

/** All display text, already localized by the connected `StreakFreezeCard`; a story passes i18n keys. */
export interface StreakFreezeCardLabels {
    title: string
    errorTitle: string
    retry: string
    /** Already interpolated with the owned count and {@link MAX_FREEZES} (e.g. "2 of 3"). */
    owned: string
    explainer: string
    /** Already interpolated with {@link FREEZE_COST} (e.g. "Buy for 100 points"). */
    buy: string
    full: string
}

/** Props for {@link _StreakFreezeCard} — presentational; all data resolved, no fetch/store/i18n. */
export interface StreakFreezeCardProps {
    /** First load, nothing in hand → the whole card shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no data (signed out / genuinely unavailable) → the card self-hides. */
    isEmpty?: boolean
    /**
     * Truthy → the error message (beats loading + empty). The connected file only passes its
     * settled fetch error when there is no cached data left to fall back to.
     */
    error?: unknown
    /** Retry handler — paired with `labels.retry`. */
    onRetry?: () => void
    /** How many freezes the viewer currently owns. */
    owned?: number
    /** `true` while the purchase mutation is in flight. */
    buying?: boolean
    /** Fired when the learner presses "Buy". */
    onBuy?: () => void
    labels: StreakFreezeCardLabels
}

/**
 * Right-rail "streak freeze" card — the presentational half of {@link StreakFreezeCard}. A freeze
 * keeps the daily streak alive when the viewer misses a single day; shows how many they own (of
 * {@link MAX_FREEZES}) and a "buy for {@link FREEZE_COST} points" trigger. Four states in the fixed
 * order error → loading → empty → content (BLOCK-8): a settled `error` falls to the shared
 * `AsyncContentError` frame with no card shell around it (a stale card beats a scary error, but an
 * error replaces the card rather than living inside it); `isEmpty` self-hides entirely (no
 * `emptyContent` — matches the sibling right-rail widgets); otherwise the owned line, explainer, and
 * buy button render inside `SectionCard`, with `isSkeleton` threaded to every leaf so the shimmer
 * mirrors the loaded shape. See `tiers/split.md` — the connected `index.tsx` owns the fetch, the
 * `buyStreakFreeze` mutation, and i18n.
 *
 * @param props - {@link StreakFreezeCardProps}
 */
export const _StreakFreezeCard = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    owned = 0,
    buying = false,
    onBuy,
    labels,
}: StreakFreezeCardProps) => {
    // error → skeleton → empty → content (BLOCK-8): error beats a stale loading flag.
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return null
    }

    const full = owned >= MAX_FREEZES

    return (
        <SectionCard
            icon={() => <SnowflakeIcon className="size-5 text-accent-soft-foreground" />}
            title={labels.title}
        >
            <Typography
                size="sm"
                weight="medium"
                text={labels.owned}
                isSkeleton={isSkeleton}
            />
            <Typography
                size="xs"
                color="muted"
                text={labels.explainer}
                isSkeleton={isSkeleton}
                classNames={isSkeleton ? ["w-full"] : undefined}
            />
            {isSkeleton ? (
                <Button isSkeleton variant="tertiary" size="sm" />
            ) : (
                <Button
                    variant="tertiary"
                    size="sm"
                    isDisabled={full || buying}
                    isPending={buying}
                    label={full ? labels.full : labels.buy}
                    onPress={onBuy}
                />
            )}
        </SectionCard>
    )
}
