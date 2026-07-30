import React from "react"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { UserCell } from "@sb-components/atoms/display/UserCell/UserCell"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `WeeklyChallengeCard`: "Thử thách tuần" — the featured challenge of
 * the week: a routable title, a countdown, the viewer's pass/claim status,
 * the total pass count, and a short leaderboard of recent finishers.
 *
 * GROUND TRUTH: `src`'s `components/features/dashboard/WeeklyChallengeCard/
 * index.tsx`, backed by the real `weeklyChallenge` query
 * (`QueryWeeklyChallengeData | null` — `null` is a REAL shape: "no event
 * active", not a loading/error condition).
 *
 * COMPOSED, NOT REBUILT: the card face is `SurfaceCard` (labeled variant, same
 * as every sibling dashboard block in this pass), the finisher list is
 * `SurfaceCardList` (nested variant — it already sits inside this card's own
 * face) with each row's identity built from the `UserCell` atom, unchanged
 * from `LeaderboardBoard`'s own row shape.
 *
 * ⭐ THE FRAME NEVER UNMOUNTS. `src`'s own file header calls this out
 * explicitly: the label stays up across loading / no-active-event / content so
 * the dashboard slot never disappears. Here that falls out of the structure
 * for free — `SurfaceCard` wraps `AsyncContent` (not the other way around), so
 * the label renders once, above whichever of the four branches is active,
 * same architecture as this pass's `WeeklyGoals`/`JobReadinessWidget`.
 *
 * ⭐ ROUTING IS FULLY CALLER-BUILT (§14d.1, same convention as
 * `JobReadinessWidget.nextAction`). `src` resolves the challenge's route via a
 * dashboard-only hook (`useResolveRouteNavigation` against an opaque
 * `globalId`) — that resolve-and-navigate round trip is screen wiring, not
 * generic block knowledge, so `onOpenChallenge` arrives pre-resolved and
 * covers BOTH the title link and the "Làm ngay" prompt (the exact same
 * destination in `src`, just two entry points into it). Omitted → both render
 * as plain, non-interactive text (mirrors `EntityToken`'s own `!routable`
 * fallback).
 *
 * ⭐ THE COUNTDOWN AND EACH FINISHER'S TIMESTAMP ARRIVE PRE-WORDED (§14d.1,
 * same boundary as `ChallengeDeliverableItem.processedAt`/`WeeklyGoals.
 * resetInLabel`): this block owns no date/locale math, so `endsInLabel` and
 * each entry's `passedAtLabel` are caller-built strings, omitted while unknown
 * instead of raw ISO timestamps for this block to parse.
 *
 * ⭐ THE PASSED-COUNT AND REWARD LINES ARE BLOCK WORDING (same convention as
 * `LeaderboardBoard`'s "Hạng #N"): `passedCount`/`coinReward` are typed
 * numbers, and the Vietnamese sentence/button label around them is built HERE.
 *
 * ⭐ AN ADDED ERROR BRANCH, NOT IN `src`. `src`'s own `AsyncContent` call never
 * passes `error`/`errorContent` — the SWR `error` sits unused. That reads as a
 * real gap rather than a deliberate absence (every sibling dashboard block in
 * this pass wires the same SWR error into a retry branch), so this block wires
 * it the same way its siblings do.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One leaderboard row: a finisher who already passed this week's challenge. */
export interface WeeklyChallengeLeaderboardEntry {
    /** Stable React key — the finisher's username. */
    key: string
    /** Account username; drives the avatar fallback (same contract as {@link UserCell}). */
    username: string
    /** Uploaded avatar URL, or `null`/omitted — a generated default is shown instead. */
    avatar?: string | null
    /** Already-worded "x ago" label (e.g. "5 phút trước"). */
    passedAtLabel: string
}

/** The currently featured weekly-challenge event. */
export interface WeeklyChallengeData {
    /** Title of the featured challenge. */
    title: string
    /** Fired from the title AND the "Làm ngay" prompt — the caller already resolved the route. Omit when not routable. */
    onOpenChallenge?: () => void
    /** Already-worded countdown to the event's close (e.g. "còn 2 ngày 6 giờ"). Omit while unknown. */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The title: a routable link when `onOpenChallenge` is set, plain bold text otherwise. */
const titleText = (data: WeeklyChallengeData, isSkeleton: boolean, showAnatomy: boolean) =>
    data.onOpenChallenge ? (
        <Typography
            size="sm"
            isLink
            isSkeleton={isSkeleton}
            onPress={data.onOpenChallenge}
            text={data.title}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    ) : (
        <Typography
            size="sm"
            weight="bold"
            isSkeleton={isSkeleton}
            text={data.title}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    )

/** Right side of the status row: claimed chip, a pending claim button, or a "try now" prompt. */
const statusSlot = (data: WeeklyChallengeData, isSkeleton: boolean, showAnatomy: boolean) => {
    if (isSkeleton) {
        return <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
    }
    if (!data.viewerPassed) {
        return data.onOpenChallenge ? (
            <Typography
                size="xs"
                isLink
                onPress={data.onOpenChallenge}
                text="Làm ngay"
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        ) : null
    }
    if (data.claimed) {
        return (
            <Chip tone="success" text="Đã hoàn thành" anatPart={showAnatomy ? "Chip" : undefined} />
        )
    }
    return (
        <Button
            variant="primary"
            size="sm"
            isPending={data.isClaiming}
            onPress={data.onClaim}
            label={`Nhận ${data.coinReward ?? 0} xu`}
            anatPart={showAnatomy ? "Button" : undefined}
        />
    )
}

/** Builds one finisher's free-form `SurfaceCardList` content: the unchanged `UserCell`. */
const finisherItem = (entry: WeeklyChallengeLeaderboardEntry, isSkeleton: boolean, showAnatomy: boolean): SurfaceCardListItem => ({
    key: entry.key,
    content: (
        <div data-anat-part={showAnatomy ? "UserCell" : undefined}>
            <UserCell
                username={entry.username}
                avatar={entry.avatar}
                trailing={(
                    <Typography
                        size="xs"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : entry.passedAtLabel}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                )}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
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
    showAnatomy: boolean
}

const Content = ({ data, isSkeleton, showAnatomy }: ContentProps) => (
    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
        {titleText(data, isSkeleton, showAnatomy)}
        <StackH gap="grouped" justify="between" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
            {data.endsInLabel != null || isSkeleton ? (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : data.endsInLabel}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : <span />}
            {statusSlot(data, isSkeleton, showAnatomy)}
        </StackH>
        <Typography
            size="xs"
            color="muted"
            isSkeleton={isSkeleton}
            text={isSkeleton ? undefined : `${data.passedCount} người đã vượt qua`}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
        {data.leaderboard.length > 0 ? (
            <div data-anat-part={showAnatomy ? "SurfaceCardList" : undefined}>
                <SurfaceCardList
                    variant="nested"
                    items={data.leaderboard.map((entry) => finisherItem(entry, isSkeleton, showAnatomy))}
                    showAnatomy={showAnatomy}
                />
            </div>
        ) : null}
    </StackV>
)

/**
 * "Thử thách tuần" — the featured weekly-challenge card. See the file header
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
    showAnatomy = false,
    anatPart,
}: WeeklyChallengeCardProps) => (
    <SurfaceCard
        label="Thử thách tuần"
        anatPart={anatPart}
        showAnatomy={showAnatomy}
    >
        <AsyncContent
            isLoading={isLoading}
            skeleton={<Content data={LOADING_DATA} isSkeleton showAnatomy={showAnatomy} />}
            isEmpty={isEmpty}
            emptyContent={{
                title: "Chưa có thử thách nào đang diễn ra",
                description: "Quay lại vào đầu tuần sau để xem thử thách mới.",
            }}
            error={error}
            errorContent={{
                title: "Không tải được thử thách tuần",
                description: "Thử lại để xem thông tin mới nhất.",
                onRetry,
                retryLabel: "Thử lại",
            }}
            showAnatomy={showAnatomy}
        >
            {data ? (
                <Content data={data} isSkeleton={isSkeleton} showAnatomy={showAnatomy} />
            ) : null}
        </AsyncContent>
    </SurfaceCard>
)

export { WeeklyChallengeCard }
