"use client"

import React from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { queryCodingLeaderboard } from "@/modules/api/graphql/queries/query-coding-leaderboard"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH } from "@/components/frames/Stack"

/** Max ranked users to pull for the board (backend caps this too). */
const LEADERBOARD_LIMIT = 50

/** Placeholder rows shown while the board loads. */
const SKELETON_ROWS = 6

/** One ranked entry as returned by `codingLeaderboard`. */
interface LeaderboardEntry {
    userId: string
    username: string
    solvedCount: number
}

/** Props for {@link LeaderboardRow}. */
interface LeaderboardRowProps {
    /** 1-based position on the board. */
    rank: number
    /** The ranked user. Absent only while {@link LeaderboardRowProps.isSkeleton}. */
    entry?: LeaderboardEntry
    /** Tints the signed-in viewer's own row. */
    isViewer?: boolean
    /** Already-translated "N solved" metric. */
    solvedLabel?: string
    /** Already-translated "you" chip label. */
    youLabel?: string
    /** First load → this row rests. Its resting state lives here, beside the loaded one. */
    isSkeleton?: boolean
}

/**
 * One board row: rank · avatar + name · the solved metric. ONE description of the
 * shape, resting or loaded, so the two cannot drift (`loading-and-skeleton.md`).
 *
 * @param props - {@link LeaderboardRowProps}
 */
const LeaderboardRow = ({ rank, entry, isViewer = false, solvedLabel, youLabel, isSkeleton = false }: LeaderboardRowProps) => (
    <SurfaceListCardItem className={!isSkeleton && isViewer ? "bg-accent-soft" : undefined}>
        <StackH
            gap={4}
            align="center"
            items={[
                // the rank column is a fixed gutter so every name starts on the same line
                () => (
                    <Box className="w-6 shrink-0">
                        <Typography
                            size="sm"
                            weight="semibold"
                            color="muted"
                            align="center"
                            isSkeleton={isSkeleton}
                            text={String(rank)}
                        />
                    </Box>
                ),
                () => (isSkeleton
                    ? <Skeleton.Avatar size="sm" />
                    : (
                        <UserCell
                            username={entry?.username ?? ""}
                            size="sm"
                            className="flex-1"
                            trailing={isViewer ? <Chip tone="accent" text={youLabel} /> : undefined}
                        />
                    )),
                ...(isSkeleton ? [() => <Typography size="sm" isSkeleton classNames={["flex-1"]} />] : []),
                // the ranking metric — distinct problems solved (NOT points)
                () => (
                    <Typography
                        size="sm"
                        weight="semibold"
                        color="accent-soft"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}
                        text={solvedLabel}
                    />
                ),
            ]}
        />
    </SurfaceListCardItem>
)

/**
 * The GLOBAL coding leaderboard — every user ranked by **distinct problems solved**
 * (`solvedCount`, the exact axis the backend `codingLeaderboard` orders on; NOT
 * points — those are a different currency). A single capped reading column:
 * rank · avatar · name · "N solved", with the signed-in viewer's row accent-tinted.
 * The viewer's own standing (rank / percentile / points) lives in the ProgressCockpit
 * above this on the page, so the board itself is just the list. **No podium** —
 * coding is a pure ranked list. Self-contained: it reads the viewer id from the store
 * and drives its own SWR.
 */
export const CodingLeaderboard = () => {
    const t = useTranslations()
    // viewer identity highlights their own row
    const viewerId = useAppSelector((state) => state.user.user?.id) ?? null

    const { data, isLoading, error, mutate } = useSWR(
        ["coding-leaderboard", LEADERBOARD_LIMIT],
        async () => {
            const response = await queryCodingLeaderboard({
                request: { limit: LEADERBOARD_LIMIT },
            })
            return response.data?.codingLeaderboard.data ?? []
        },
    )

    const entries = data ?? []
    const isSkeleton = isLoading && !data

    // error beats a stale loading flag; empty only once settled (BLOCK-8 order).
    if (error) {
        return (
            <AsyncContentError
                title={t("practice.leaderboard.error")}
                onRetry={() => { void mutate() }}
                retryLabel={t("practice.retry")}
            />
        )
    }
    if (!isSkeleton && entries.length === 0) {
        return <AsyncContentEmpty title={t("practice.leaderboard.empty")} />
    }

    return (
        // the board keeps a capped reading measure — a width no closed union carries
        <Box className="mx-auto w-full max-w-2xl">
            <SurfaceListCard identity={{ tier: "block", component: "CodingLeaderboard" }}>
                {isSkeleton
                    ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                        <LeaderboardRow key={index} rank={index + 1} isSkeleton />
                    ))
                    : entries.map((entry, index) => (
                        // rank is implicit array order (board is pre-sorted by solvedCount desc)
                        <LeaderboardRow
                            key={entry.userId}
                            rank={index + 1}
                            entry={entry}
                            isViewer={!!viewerId && entry.userId === viewerId}
                            solvedLabel={t("practice.leaderboard.solved", { count: entry.solvedCount })}
                            youLabel={t("practice.leaderboard.you")}
                        />
                    ))}
            </SurfaceListCard>
        </Box>
    )
}
