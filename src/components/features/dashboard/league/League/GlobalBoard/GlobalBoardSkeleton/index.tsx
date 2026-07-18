"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/** Number of placeholder rows (rank 4+) shown while the global leaderboard loads. */
const SKELETON_ROW_COUNT = 6

/** Props for {@link GlobalBoardSkeleton}. */
export type GlobalBoardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").GlobalBoard}: mirrors the real board
 * shell — the `StandingHeroCard` (badge + rank line + meta + goal meter + CTA), the
 * top-3 `Podium` dais, then rank-4+ rows inside a `SurfaceListCard`
 * [rank · avatar · name · points]. (Was wrong: no hero, no podium, loose rows.)
 *
 * @param props - {@link GlobalBoardSkeletonProps}
 */
export const GlobalBoardSkeleton = ({ className }: GlobalBoardSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* your standing hero — badge · rank/meta · goal meter · CTA */}
            <div className="flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-surface">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-10 shrink-0 rounded-2xl" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <Skeleton.Typography type="h6" width="1/2" />
                        <Skeleton.Typography type="body-sm" width="1/3" />
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton.Typography type="body-xs" width="1/3" />
                    <Skeleton.ProgressBar />
                </div>
                <Skeleton className="h-10 w-40 rounded-full" />
            </div>

            {/* the winners' dais — top-3 (champion centered + raised) */}
            <div className="flex items-end justify-center gap-3">
                {[false, true, false].map((isChampion, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        <Skeleton className={cn("shrink-0 rounded-full", isChampion ? "size-14" : "size-12")} />
                        <div className="flex w-20 flex-col items-center gap-1">
                            <Skeleton.Typography type="body-sm" width="3/4" />
                            <Skeleton.Typography type="body-xs" width="1/2" />
                        </div>
                        <Skeleton className={cn("w-20 rounded-t-2xl rounded-b-none", isChampion ? "h-16" : "h-10")} />
                    </div>
                ))}
            </div>

            {/* rank 4+ rows — [rank · avatar · name · points] */}
            <SurfaceListCard>
                {Array.from({ length: SKELETON_ROW_COUNT }).map((_row, index) => (
                    <SurfaceListCardItem key={index}>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />
                            <Skeleton.Avatar size="sm" />
                            <Skeleton.Typography type="body-sm" width="1/3" className="min-w-0 flex-1" />
                            <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
                        </div>
                    </SurfaceListCardItem>
                ))}
            </SurfaceListCard>
        </div>
    )
}
