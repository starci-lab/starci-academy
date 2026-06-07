"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { SkeletonText } from "@/components/reuseable"

/** Props for {@link LeaderboardSkeleton}. */
export interface LeaderboardSkeletonProps {
    /** Number of placeholder rows under the podium. Defaults to `6`. */
    rows?: number
}

/**
 * Loading placeholder for the leaderboard: a three-pedestal podium block above a
 * list of row placeholders, mirroring {@link LeaderboardPodium} + {@link LeaderboardTable}.
 * @param props - {@link LeaderboardSkeletonProps}
 */
export const LeaderboardSkeleton = ({ rows = 6 }: LeaderboardSkeletonProps) => {
    return (
        <div className="flex flex-col gap-6">
            {/* podium: three pedestals, the middle one tallest */}
            <div className="flex items-end justify-center gap-3 sm:gap-6">
                {[16, 24, 12].map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                        <Skeleton className="size-12 rounded-full" />
                        <SkeletonText size="sm" width="w-16" />
                        <Skeleton
                            className="w-full rounded-t-xl"
                            style={{ height: `${height * 4}px` }}
                        />
                    </div>
                ))}
            </div>
            {/* ranked rows */}
            <div className="flex flex-col gap-1.5">
                {Array.from({ length: Math.max(rows, 1) }).map((_unused, index) => (
                    <div key={index} className="flex items-center gap-3 px-3 py-2.5">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex flex-1 flex-col gap-1">
                            <SkeletonText size="sm" width="w-1/3" />
                            <SkeletonText size="xs" width="w-1/2" />
                        </div>
                        <SkeletonText size="sm" width="w-12" />
                    </div>
                ))}
            </div>
        </div>
    )
}
