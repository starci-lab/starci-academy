import React from "react"
import {
    AsyncContentEmpty,
    AsyncContentError,
} from "@/components/composites/async/AsyncContent"
import {
    Button,
} from "@/components/atoms/buttons/Button"
import {
    Chip,
} from "@/components/atoms/chips/Chip"
import {
    Typography,
} from "@/components/atoms/text/Typography"
import {
    Skeleton,
} from "@/components/blocks/skeleton/Skeleton"
import {
    LabeledCard,
} from "@/components/blocks/cards/LabeledCard"
import {
    SurfaceListCard,
    SurfaceListCardItem,
    SurfaceListCardRow,
} from "@/components/blocks/cards/SurfaceListCard"
import {
    UserAvatar,
} from "@/components/blocks/identity/UserAvatar"
import {
    EntityToken,
} from "@/components/blocks/entity/EntityToken"
import {
    StackH,
    StackV,
} from "@/components/frames/Stack"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** How many placeholder finisher rows the co-located skeleton shows while shimmering. */
const SKELETON_ROW_COUNT = 3

/** All display text, already localized by the connected `WeeklyChallengeCard`; a story passes i18n keys. */
export interface WeeklyChallengeCardLabels {
    /** Section title, shown outside the card in every state. */
    title: string
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
    /** "Ends in {days}d {hours}h" — already interpolated. Set whenever real data is in hand. */
    endsIn?: string
    passed: string
    /** "Claim +{count} coins" — already interpolated with the reward amount. */
    claimReward: string
    tryNow: string
    /** "{count} learners passed" — already interpolated. */
    passedCount: string
}

/** One leaderboard row, already localized by the connected file (the "x ago" label). */
export interface WeeklyChallengeCardLeaderboardEntry {
    username: string
    avatar: string | null
    relativeLabel: string
}

/** Props for {@link _WeeklyChallengeCard} — presentational; all data resolved, no fetch/store/i18n. */
export interface WeeklyChallengeCardProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no active event → the empty message, still inside the labeled card frame. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** Opaque id of the featured challenge (routes the title/CTA tokens). */
    challengeGlobalId?: string | null
    /** Title of the featured challenge — raw content, not translated. */
    challengeTitle?: string
    /** Whether the viewer already passed this week's challenge. */
    viewerPassed?: boolean
    /** Whether the viewer already claimed the reward for passing. */
    claimed?: boolean
    /** `true` while the claim mutation is in flight (spinner replaces the claim button's glyph). */
    isClaiming?: boolean
    onClaim?: () => void
    /** Recent finishers, already sliced and localized by the connected file. */
    leaderboard?: Array<WeeklyChallengeCardLeaderboardEntry>
    labels: WeeklyChallengeCardLabels
}

/**
 * "This week's challenge" section — the presentational half of {@link import("./index").WeeklyChallengeCard}:
 * title (routable), a live countdown, the viewer's pass status, total pass count, and a short
 * leaderboard of recent finishers. Owns its own `LabeledCard` frame (label outside), which STAYS
 * MOUNTED across every state — the error and empty messages render INSIDE it instead of the section
 * self-hiding, so the DashboardPage slot never disappears entirely. Three states in the fixed order
 * error → loading → empty → content: `error` falls to the shared `AsyncContentError` frame, `isEmpty`
 * to `AsyncContentEmpty`, and otherwise the real tree renders with `isSkeleton` threaded to every leaf
 * that supports it (loading-and-skeleton.md). `EntityToken`/`UserAvatar`/`SurfaceListCardRow` take no
 * `isSkeleton` of their own, so the leaderboard rows are mirrored with `Skeleton.*` pieces in place
 * while shimmering instead (see `missingSkeletonSupport`). See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link WeeklyChallengeCardProps}
 */
export const _WeeklyChallengeCard = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    challengeGlobalId,
    challengeTitle,
    viewerPassed = false,
    claimed = false,
    isClaiming = false,
    onClaim,
    leaderboard = [],
    labels,
    className,
}: WeeklyChallengeCardProps) => {
    /** The card's body — error beats a stale loading flag; empty only once settled (BLOCK-8). */
    const body = () => {
        if (error) {
            return (
                <AsyncContentError
                    title={labels.errorTitle}
                    onRetry={onRetry}
                    retryLabel={labels.retry}
                />
            )
        }
        if (!isSkeleton && isEmpty) {
            return (
                <AsyncContentEmpty
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                />
            )
        }

        // ROWS — while shimmering, placeholder rows keep the SAME count shape (loading-and-skeleton.md
        // §1). `SurfaceListCardRow` wraps a plain (non-skeleton-aware) `Typography` internally and
        // `UserAvatar` takes no `isSkeleton` either, so the placeholder rows are built from
        // `SurfaceListCardItem` + `Skeleton.*` pieces sized to match the real row instead.
        const showLeaderboard = isSkeleton || leaderboard.length > 0

        return (
            <StackV gap={3} items={[
                // featured challenge title (routable) — EntityToken has no isSkeleton (missingSkeletonSupport)
                () => (isSkeleton
                    ? <Skeleton.Typography type="body-sm" width="2/3" />
                    : <EntityToken globalId={challengeGlobalId} label={challengeTitle ?? ""} />),

                // countdown (left) + viewer status (right)
                () => (
                    <StackH gap={3} justify="between" items={[
                        () => (
                            <Typography
                                size="xs"
                                color="muted"
                                text={labels.endsIn ?? ""}
                                isSkeleton={isSkeleton}
                                classNames={isSkeleton ? ["w-1/3"] : undefined}
                            />
                        ),
                        () => (isSkeleton
                            ? <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
                            : viewerPassed
                                ? (claimed
                                    ? <Chip tone="success" text={labels.passed} />
                                    : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            isPending={isClaiming}
                                            onPress={onClaim}
                                            label={labels.claimReward}
                                        />
                                    ))
                                : <EntityToken globalId={challengeGlobalId} label={labels.tryNow} />),
                    ]} />
                ),

                // total passers
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        text={labels.passedCount}
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}
                    />
                ),

                // recent finishers — joined bordered SurfaceListCard (not loose rows)
                ...(showLeaderboard ? [() => (
                    <SurfaceListCard bordered>
                        {isSkeleton
                            ? Array.from({ length: SKELETON_ROW_COUNT }, (_row, index) => (
                                <SurfaceListCardItem key={index}>
                                    <StackH gap={3} items={[
                                        () => <Skeleton className="size-6 shrink-0 rounded-full" />,
                                        () => <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />,
                                        () => <Skeleton className="h-3 w-12 shrink-0 rounded-sm" />,
                                    ]} />
                                </SurfaceListCardItem>
                            ))
                            : leaderboard.map((entry) => (
                                <SurfaceListCardRow
                                    key={entry.username}
                                    leading={() => (
                                        <UserAvatar
                                            className="size-6 shrink-0"
                                            username={entry.username}
                                            avatar={entry.avatar}
                                            seed={entry.username}
                                        />
                                    )}
                                    title={entry.username}
                                    trailing={() => (
                                        <Typography
                                            size="xs"
                                            color="muted"
                                            text={entry.relativeLabel}
                                            classNames={["shrink-0"]}
                                        />
                                    )}
                                />
                            ))}
                    </SurfaceListCard>
                )] : []),
            ]} />
        )
    }

    return (
        <LabeledCard
            identity={{ tier: "block", component: "WeeklyChallengeCard" }}
            label={labels.title}
            className={className}
        >
            {body()}
        </LabeledCard>
    )
}
