import React from "react"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"
import { type LeaderboardPodiumEntry } from "../types"

/** Visual order left→right on the dais: 2nd, 1st (centre), 3rd. */
const PODIUM_VISUAL_ORDER: Record<1 | 2 | 3, number> = { 2: 1, 1: 2, 3: 3 }
/** Riser height by rank — 1st tallest, so the dais itself carries the ranking, not just a label. */
const PODIUM_RISER_HEIGHT: Record<1 | 2 | 3, string> = { 1: "h-20", 2: "h-14", 3: "h-10" }

/** Props for the internal {@link Podium} piece. */
interface PodiumProps {
    /** Top-3 finishers, in any order. */
    entries: Array<LeaderboardPodiumEntry>
    /** Accessible tag for "this is you", forwarded from the block. */
    meLabel: string
    isSkeleton: boolean
}

/** One podium dais entry: avatar, username, score line, ranked riser. */
const podiumEntryCard = (entry: LeaderboardPodiumEntry, meLabel: string, isSkeleton: boolean) => {
    const riser = (
        <div className={`flex w-full items-center justify-center rounded-t-xl bg-accent-soft ${PODIUM_RISER_HEIGHT[entry.rank]}`}>
            {/* real `src` (`Podium/index.tsx:103-112`): the rank number is a BARE div,
                declaring no size at all (inherits base/16px), just `font-bold` — not `lg`. */}
            <Typography
                size="base"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={isSkeleton ? undefined : String(entry.rank)}
                color="accent-soft"

            />
        </div>
    )
    return (
        <div key={entry.rank} className="w-24">
            <StackV
                gap={2}
                principles={["title-subtitle"]}
                align="center"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <div>
                            <Avatar
                                name={entry.username}
                                src={entry.avatar ?? undefined}
                                seed={entry.username}
                                size={entry.rank === 1 ? "lg" : "md"}
                                isSkeleton={isSkeleton}

                            />
                        </div>
                    ),
                    () => (
                        <Typography
                            size="sm"
                            weight="medium"
                            color={entry.isMe ? "accent" : undefined}
                            truncate
                            align="center"
                            isSkeleton={isSkeleton}
                            text={isSkeleton ? undefined : entry.username}
                            classNames={["w-full"]}

                        />
                    ),
                    () => (
                        <Typography
                            size="xs"
                            color="muted"
                            isSkeleton={isSkeleton}
                            text={isSkeleton ? undefined : entry.pointsLabel}

                        />
                    ),
                    () => riser,
                    ...(entry.isMe ? [() => <span className="sr-only">{meLabel}</span>] : []),
                ]}
            />
        </div>
    )
}

/** One podium dais entry: avatar, username, score line, ranked riser. */
export const Podium = ({ entries, meLabel, isSkeleton }: PodiumProps) => (
    <StackH
        gap={3}
        principles={["sibling-stack"]}
        justify="center"
        align="end"
        isSkeleton={isSkeleton}
        items={[...entries]
            .sort((a, b) => PODIUM_VISUAL_ORDER[a.rank] - PODIUM_VISUAL_ORDER[b.rank])
            .map((entry) => () => podiumEntryCard(entry, meLabel, isSkeleton))}
    />
)
