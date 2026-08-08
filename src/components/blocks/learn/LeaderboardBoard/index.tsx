"use client"

import React from "react"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { Board } from "./Board"
import { Confetti } from "./Confetti"
import {
    type LeaderboardBoardProps,
    type LeaderboardPodiumEntry,
    type LeaderboardRow,
    type LeaderboardStanding,
} from "./types"

export type {
    LeaderboardStanding,
    LeaderboardPodiumEntry,
    LeaderboardRow,
    LeaderboardBoardProps,
} from "./types"

/**
 * BLOCK — `LeaderboardBoard`: the ranked board itself. See the component's own
 * file header for the full reuse contract; this file only adds the states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): loading / empty / error / how many rows / whether
 * the viewer needs pinning are all DATA — `AsyncContent`'s own branch switch
 * already reads that way — so this block has exactly ONE leaf ("Board") and five
 * states inside it, the same shape `QuizRecapList`'s single `Full` leaf uses.
 */

/** Fixed-shape placeholder rendered while {@link AsyncContentBaseProps.isLoading} — no real data exists yet. */
const LOADING_PODIUM: Array<LeaderboardPodiumEntry> = [
    { rank: 2, username: "", pointsLabel: "" },
    { rank: 1, username: "", pointsLabel: "" },
    { rank: 3, username: "", pointsLabel: "" },
]
const LOADING_ROWS: Array<LeaderboardRow> = Array.from({ length: 5 }, (_, index) => ({
    key: `loading-${index}`,
    rank: index + 4,
    username: "",
    valueLabel: "",
}))
const LOADING_STANDING: LeaderboardStanding = { rank: 0, primaryLabel: "" }

/**
 * The ranked board itself. See the file header for the reuse contract, the two
 * new internal parts, and the single-leaf/multi-state read of the async switch.
 *
 * @param props - {@link LeaderboardBoardProps}
 */
const LeaderboardBoard = ({
    isLoading,
    isEmpty,
    error,
    onRetry,
    standing,
    podiumEntries,
    rows,
    selfRow,
    hiddenBetweenCount,
    celebrateKey,
    meLabel,
    isSkeleton = false,
}: LeaderboardBoardProps) => (
    <AsyncContent
        isLoading={isLoading}
        skeleton={() => (
            <Board
                standing={LOADING_STANDING}
                podiumEntries={LOADING_PODIUM}
                rows={LOADING_ROWS}
                meLabel=""
                isSkeleton
            />
        )}
        isEmpty={isEmpty}
        emptyContent={{
            title: "The leaderboard has no one yet",
            description: "Complete a lesson to claim the first spot.",
        }}
        error={error}
        errorContent={{
            title: "Couldn't load the leaderboard",
            description: "Try again to see the latest standings.",
            onRetry,
            retryLabel: "Try again",
        }}
        content={() => (
            <>
                {/* Only the CONTENT branch celebrates — there is nothing worth confetting
                    over loading chrome, an empty board, or an error message. */}
                <Confetti celebrateKey={celebrateKey} />
                <Board
                    standing={standing}
                    podiumEntries={podiumEntries}
                    rows={rows}
                    selfRow={selfRow}
                    hiddenBetweenCount={hiddenBetweenCount}
                    meLabel={meLabel}
                    isSkeleton={isSkeleton}
                />
            </>
        )}
    />
)

export { LeaderboardBoard }
