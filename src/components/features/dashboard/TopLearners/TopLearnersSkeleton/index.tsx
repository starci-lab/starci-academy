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
 * Loading placeholder for {@link import("../").TopLearners}: mirrors the frameless
 * LabeledCard + `SurfaceListCard` (label outside + N leader rows: rank · avatar ·
 * name · XP · follow) so the block keeps its height when the global leaderboard
 * resolves.
 * @param props - {@link TopLearnersSkeletonProps}
 */
export const TopLearnersSkeleton = ({ className }: TopLearnersSkeletonProps) => (
    <div className={cn("flex flex-col gap-3", className)}>
        <Skeleton.Typography type="body-sm" width="1/3" />
        <SurfaceListCard>
            {Array.from({ length: SKELETON_ROWS }).map((_row, index) => (
                <SurfaceListCardItem key={index}>
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-8 shrink-0 rounded-full" />
                        <Skeleton.Typography type="body-sm" width="1/2" />
                        <Skeleton className="ml-auto h-8 w-24 shrink-0 rounded-xl" />
                    </div>
                </SurfaceListCardItem>
            ))}
        </SurfaceListCard>
    </div>
)
