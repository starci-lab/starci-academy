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

/** Number of placeholder rows (mirrors the loaded top-N). */
const SKELETON_ROWS = 5

/** Props for {@link TopLearnersSkeleton}. */
export type TopLearnersSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").TopLearners} — mirrors the real
 * `LeaderboardListCard`: label + a standing header (IconTile medal badge + primary +
 * secondary line) + a `bordered` `SurfaceListCard` of rows
 * [rank slot · avatar size-8 · name · XP value · follow]. (Was wrong: single-line
 * standing with no badge, rows missing the rank slot + XP value.)
 * @param props - {@link TopLearnersSkeletonProps}
 */
export const TopLearnersSkeleton = ({ className }: TopLearnersSkeletonProps) => (
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
        {/* leader rows — [rank · avatar · name · XP value · follow] */}
        <SurfaceListCard bordered>
            {Array.from({ length: SKELETON_ROWS }).map((_row, index) => (
                <SurfaceListCardItem key={index}>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />
                        <Skeleton.Avatar size="sm" />
                        <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />
                        <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
                        <Skeleton className="h-8 w-24 shrink-0 rounded-xl" />
                    </div>
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    </div>
)
