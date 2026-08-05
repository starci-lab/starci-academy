import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Chip } from "@/components/atoms/chips/Chip"
import { Button } from "@/components/atoms/buttons/Button"
import { UserCell } from "@/components/composites/lists/UserCell"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * BLOCK — `WeeklyChallengeCard`: "Weekly Challenge" — the featured challenge of
 * the week. See the component's own file header for the full contract; this
 * file only adds the states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): whether the viewer already passed, already
 * claimed, or the leaderboard is short, are all DATA conditions of the same
 * status row/list — never a different shape this block draws — so this block
 * has exactly ONE leaf ("Content"), the same shape `LeaderboardBoard`'s single
 * `Board` leaf uses.
 */

/** One leaderboard row: a finisher who already passed this week's challenge. */
export interface WeeklyChallengeLeaderboardEntry {
    /** Stable React key — the finisher's username. */
    key: string
    /** Account username; drives the avatar fallback (same contract as {@link UserCell}). */
    username: string
    /** Uploaded avatar URL, or `null`/omitted — a generated default is shown instead. */
    avatar?: string | null
    /** Already-worded "x ago" label (e.g. "5 minutes ago"). */
    passedAtLabel: string
}

/** The currently featured weekly-challenge event. */
export interface WeeklyChallengeData {
    /** Title of the featured challenge. */
    title: string
    /** Fired from the title AND the "Try it now" prompt — the caller already resolved the route. Omit when not routable. */
    onOpenChallenge?: () => void
    /** Already-worded countdown to the event's close (e.g. "2 days 6 hours left"). Omit while unknown. */
    endsInLabel?: string
    /** Whether the viewer has already passed the challenge this week. */
    viewerPassed: boolean
    /** Whether the viewer already claimed the reward this week. Ignored unless `viewerPassed`. */
    claimed: boolean
    /** Coin reward for claiming; `null` when the viewer hasn't passed yet. */
    coinReward: number | null
    /** `true` → the claim mutation is in flight — disables + spins the claim button. */
    isClaiming?: boolean
    /** Fired when the viewer presses the claim button. Required whenever `viewerPassed && !claimed`. */
    onClaim?: () => void
    /** Total number of users who have passed so far. */
    passedCount: number
    /** Top finishers (already capped by the caller), newest first. */
    leaderboard: Array<WeeklyChallengeLeaderboardEntry>
}

/** Props for {@link WeeklyChallengeCard}. */
export interface WeeklyChallengeCardProps {
    /** True while the first load is running — {@link AsyncContent}'s loading branch. */
    isLoading: boolean
    /** True (once loaded) → no challenge event is currently active. */
    isEmpty: boolean
    /** Truthy → the snapshot failed to load. Pass SWR's `error`. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry: () => void
    /** The featured challenge. Required once loaded and non-empty. */
    data?: WeeklyChallengeData
    /** `true` → every atom this block owns switches to its own shimmer (data already loaded). */
    isSkeleton?: boolean
}

/** The title: a routable link when `onOpenChallenge` is set, plain bold text otherwise. */
const titleText = (data: WeeklyChallengeData, isSkeleton: boolean) =>
    data.onOpenChallenge ? (
        <Typography
            size="sm"
            isLink
            isSkeleton={isSkeleton}
            onPress={data.onOpenChallenge}
            text={data.title}

        />
    ) : (
        <Typography
            size="sm"
            weight="bold"
            isSkeleton={isSkeleton}
            text={data.title}

        />
    )

/** Right side of the status row: claimed chip, a pending claim button, or a "try now" prompt. */
const statusSlot = (data: WeeklyChallengeData, isSkeleton: boolean) => {
    if (isSkeleton) {
        return <Chip isSkeleton />
    }
    if (!data.viewerPassed) {
        return data.onOpenChallenge ? (
            <Typography
                size="xs"
                isLink
                onPress={data.onOpenChallenge}
                text="Try it now"

            />
        ) : null
    }
    if (data.claimed) {
        return (
            <Chip tone="success" text="Completed" />
        )
    }
    return (
        <Button
            variant="primary"
            size="sm"
            isPending={data.isClaiming}
            onPress={data.onClaim}
            label={`Claim ${data.coinReward ?? 0} coins`}
        />
    )
}

/** Builds one finisher's free-form `SurfaceCardList` content: the unchanged `UserCell`. */
const finisherItem = (entry: WeeklyChallengeLeaderboardEntry, isSkeleton: boolean): SurfaceCardListItem => ({
    key: entry.key,
    content: () => (
        <div>
            <UserCell
                username={entry.username}
                avatar={entry.avatar}
                trailing={({ isSkeleton: slotSkeleton }: SkeletonProps) => (
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={slotSkeleton}
                        text={slotSkeleton ? undefined : entry.passedAtLabel}

                    />
                )}
                isSkeleton={isSkeleton}

            />
        </div>
    ),
})

/** Fixed-shape placeholder rendered while {@link WeeklyChallengeCardProps.isLoading} — no real event exists yet. */
const LOADING_DATA: WeeklyChallengeData = {
    title: "",
    viewerPassed: false,
    claimed: false,
    coinReward: null,
    passedCount: 0,
    leaderboard: Array.from({ length: 3 }, (_, index) => ({ key: `loading-${index}`, username: "", passedAtLabel: "" })),
}

/** Props for the internal {@link Content} tree — reused for both the real render and the loading skeleton. */
interface ContentProps {
    data: WeeklyChallengeData
    isSkeleton: boolean
}

const Content = ({ data, isSkeleton }: ContentProps) => {
    const statusRow = (
        <StackH gap={4} principles={["content-row"]} justify="between" align="center" items={[
            () => (data.endsInLabel != null || isSkeleton ? (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : data.endsInLabel}

                />
            ) : <span />),
            () => statusSlot(data, isSkeleton),
        ]} />
    )

    return (
        <StackV gap={4} items={[
            () => titleText(data, isSkeleton),
            () => statusRow,
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : `${data.passedCount} people have passed`}

                />
            ),
            ...(data.leaderboard.length > 0 ? [() => (
                <div>
                    <SurfaceCardList
                        variant="nested"
                        items={data.leaderboard.map((entry) => finisherItem(entry, isSkeleton))}

                    />
                </div>
            )] : []),
        ]} />
    )
}

/**
 * "Weekly Challenge" — the featured weekly-challenge card. See the file header
 * for the full contract.
 *
 * @param props - {@link WeeklyChallengeCardProps}
 */
const WeeklyChallengeCard = ({
    isLoading,
    isEmpty,
    error,
    onRetry,
    data,
    isSkeleton = false,
}: WeeklyChallengeCardProps) => (
    <SurfaceCard
        label="Weekly Challenge"


        body={() => (
            <AsyncContent
                isLoading={isLoading}
                skeleton={() => <Content data={LOADING_DATA} isSkeleton />}
                isEmpty={isEmpty}
                emptyContent={{
                    title: "No challenge is currently active",
                    description: "Check back next week for a new challenge.",
                }}
                error={error}
                errorContent={{
                    title: "Couldn't load the weekly challenge",
                    description: "Try again for the latest info.",
                    onRetry,
                    retryLabel: "Retry",
                }}
                content={() => (data ? (
                    <Content data={data} isSkeleton={isSkeleton} />
                ) : null)}
            />
        )}
    />
)

export { WeeklyChallengeCard }
