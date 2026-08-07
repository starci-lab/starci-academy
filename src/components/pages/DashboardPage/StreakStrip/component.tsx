import React from "react"
import { CircleIcon, FlameIcon } from "@phosphor-icons/react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Split } from "@/components/frames/Split"
import type { CallerIdentity } from "@/components/frames/_identity"

/** How many placeholder day-dots the co-located skeleton shows (last 7 days, always seven). */
const SKELETON_DAY_COUNT = 7

/** This block's own identity (BLOCK-2/split.md) — handed down to the root `StackV`. See `_identity.ts`. */
const IDENTITY: CallerIdentity = { tier: "block", component: "StreakStrip" }

/** One of the last 7 days, already resolved by the connected `StreakStrip` (locale formatting is i18n — it stays in `index.tsx`). */
export interface StreakStripDay {
    /** ISO date (`YYYY-MM-DD`) — used only as the React key. */
    date: string
    /** Whether the learner was active this day. */
    active: boolean
    /** Already-locale-formatted full date, shown as the dot's native tooltip. */
    title: string
    /** Already-locale-formatted narrow weekday label under the dot. */
    weekday: string
}

/** All display text, already localized by the connected `StreakStrip`; a story passes i18n keys. */
export interface StreakStripLabels {
    /** Error-branch title. */
    errorTitle: string
    /** Error-branch retry button label. */
    retry: string
    /** `InfoTooltip` heading over the current-streak readout. */
    streakLabel: string
    /** `InfoTooltip` explanation under {@link StreakStripLabels.streakLabel}. */
    streakHelp: string
    /** Current-streak sentence, already interpolated with the day count. */
    current: string
    /** Longest-streak chip label, already interpolated with the day count. */
    longest: string
    /** "No streak yet" message shown when there is nothing to show off. */
    empty: string
    /** Daily-goal CTA label — shared by the empty state and the idle-today nudge. */
    dailyGoalCta: string
    /** Idle-today nudge sentence ("keep the streak alive"). */
    dailyGoalNudge: string
}

/** Props for {@link _StreakStrip} — presentational; all data resolved, no fetch/store/i18n. */
export interface StreakStripProps {
    /** First load, nothing in hand → the whole strip shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Truthy → the error message (beats loading). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Current streak length, in days. */
    streak?: number
    /** Longest streak ever reached, in days. */
    /** The last 7 days, oldest first. */
    days?: Array<StreakStripDay>
    /** Fired by both daily-goal CTAs (empty state + idle-today nudge) — jumps to the course list. */
    onLearn?: () => void
    labels: StreakStripLabels
}

/**
 * "Learning streak" content — the presentational half of {@link StreakStrip}: the last-7-days dot
 * strip plus current/longest streak, and a daily-goal nudge when today is still idle. Content only
 * (the parent {@link import("@/components/blocks").LabeledCard} frames it). Two states in the fixed
 * order error → content (BLOCK-8): `error` falls to the shared `AsyncContentError` frame — there is
 * no genuine empty-fetch state, only the domain "no streak yet" message that renders inline, in place
 * of the flame/chip cluster, once settled; otherwise the strip renders with `isSkeleton` threaded to
 * every leaf so the shimmer mirrors the loaded shape. The day dot (`CircleIcon`) and the streak
 * readout (`InfoTooltip`) carry no `isSkeleton` of their own, so each is mirrored right where it sits
 * with a bare `Skeleton`/`Skeleton.Typography` (loading-and-skeleton.md §1). See `tiers/split.md` —
 * the connected `index.tsx` owns the fetch, the router, and the locale-formatted day labels.
 *
 * @param props - {@link StreakStripProps}
 */
export const _StreakStrip = ({
    isSkeleton = false,
    error,
    onRetry,
    streak = 0,
    days = [],
    onLearn,
    labels,
}: StreakStripProps) => {
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }

    // "has anything to show off" — a real streak day, or a currently-running streak. The flame/chip
    // cluster renders optimistically while shimmering (the eventual value isn't known yet); once
    // settled, a learner with nothing yet sees the empty message + CTA instead.
    const hasActivity = streak > 0 || days.some((day) => day.active)
    const showActiveCluster = isSkeleton || hasActivity
    const activeToday = days.at(-1)?.active === true
    const showNudge = !isSkeleton && hasActivity && !activeToday

    // day-dot column — while shimmering, 7 placeholder columns keep the SAME shape (loading-and-skeleton.md
    // §1: same leaf, same count). `CircleIcon` has no `isSkeleton` of its own, so the mirror sits right
    // here, co-located, rather than in a parallel tree.
    const dayItems: Array<ComponentTypeWithSkeleton> = isSkeleton
        ? Array.from({ length: SKELETON_DAY_COUNT }, () => () => (
            <StackV gap={3} principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center" items={[
                    () => <Skeleton className="size-6 shrink-0 rounded-full" />,
                    () => <Typography isSkeleton size="xs" />,
                ]} />
        ))
        : days.map((day) => () => (
            <StackV gap={3} principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                align="center" items={[
                    () => (
                    // No `title`: the dot is `aria-hidden`, so a tooltip string on it would be
                    // announced to nobody — the weekday label below carries the meaning.
                        <CircleIcon
                            aria-hidden
                            focusable="false"
                            weight="fill"
                            className={day.active ? "size-6 shrink-0 text-accent/80" : "size-6 shrink-0 text-muted/20"}
                        />
                    ),
                    () => <Typography size="xs" color="muted" text={day.weekday} />,
                ]} />
        ))

    return (
        <StackV gap={4} isSkeleton={isSkeleton} identity={IDENTITY} items={[
            () => (
                <Split gap={4} isSkeleton={isSkeleton}
                    start={() => <Cluster gap={3} isSkeleton={isSkeleton} items={dayItems} />}
                    end={() => (
                        showActiveCluster ? (
                            <StackH gap={3} isSkeleton={isSkeleton} items={[
                                () => (
                                    isSkeleton
                                        ? <Skeleton className="size-5 shrink-0 rounded-full" />
                                        : <FlameIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />
                                ),
                                () => (
                                    isSkeleton
                                        ? <Skeleton.Typography type="body-sm" width="1/4" />
                                        : (
                                            <InfoTooltip className="text-sm font-medium" title={labels.streakLabel} description={labels.streakHelp}>
                                                {labels.current}
                                            </InfoTooltip>
                                        )
                                ),
                                () => <Chip isSkeleton={isSkeleton} tone="accent" text={labels.longest} />,
                            ]} />
                        ) : (
                            <StackH gap={4} items={[
                                () => <Typography size="sm" color="muted" text={labels.empty} />,
                                () => <Button variant="primary" size="sm" onPress={onLearn} label={labels.dailyGoalCta} />,
                            ]} />
                        )
                    )}
                />
            ),
            ...(showNudge ? [() => (
                <Split gap={4}
                    start={() => <Typography size="sm" weight="medium" text={labels.dailyGoalNudge} />}
                    end={() => <Button variant="primary" size="sm" onPress={onLearn} label={labels.dailyGoalCta} />}
                />
            )] : []),
        ]} />
    )
}
