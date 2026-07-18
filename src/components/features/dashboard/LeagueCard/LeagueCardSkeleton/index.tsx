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

/** Number of placeholder cohort rows (mirrors the capped top rows). */
const SKELETON_ROWS = 5

/** Props for {@link LeagueCardSkeleton}. */
export type LeagueCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").LeagueCard} — mirrors the real
 * `LeaderboardListCard`: label + a standing header (IconTile medal badge + primary +
 * secondary line) + a `bordered` `SurfaceListCard` of rows
 * [rank slot · avatar size-8 · name · XP value · caret]. (Was wrong: a plain Card
 * with loose size-6 rows, no rank slot, no badge, no value.)
 * @param props - {@link LeagueCardSkeletonProps}
 */
export const LeagueCardSkeleton = ({ className }: LeagueCardSkeletonProps) => (
    <div className={cn("flex flex-col gap-3", className)}>
        {/* label */}
        <Skeleton.Typography type="body-sm" width="1/3" />
        {/* standing header — IconTile badge + primary + secondary */}
        <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Skeleton.Typography type="body-sm" width="1/2" />
                <Skeleton.Typography type="body-xs" width="1/3" />
            </div>
        </div>
        {/* cohort rows — [rank · avatar · name · value · caret] */}
        <SurfaceListCard bordered>
            {Array.from({ length: SKELETON_ROWS }).map((_row, index) => (
                <SurfaceListCardItem key={index}>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />
                        <Skeleton.Avatar size="sm" />
                        <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />
                        <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
                        <Skeleton className="h-4 w-8 shrink-0 rounded-sm" />
                    </div>
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    </div>
)
