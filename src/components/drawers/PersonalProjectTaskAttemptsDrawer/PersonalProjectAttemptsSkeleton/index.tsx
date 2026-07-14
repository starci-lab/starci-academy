"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { SkeletonText } from "@/components/reuseable/SkeletonText"

/** Number of placeholder attempt rows shown while the list loads. */
const SKELETON_ROW_COUNT = 5

/**
 * Loading placeholder for {@link PersonalProjectTaskAttemptsDrawer}. Mirrors the
 * real `SurfaceListCard bordered` list of {@link PersonalProjectAttemptCard} rows:
 * an attempt label, a sparkle + score-chip row, a short feedback line, and a
 * processed-time line, each row padded like the real row.
 */
export const PersonalProjectAttemptsSkeleton = () => {
    return (
        <SurfaceListCard bordered>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_unused, index) => (
                <div key={index} className="px-4 py-4">
                    {/* attempt number label */}
                    <SkeletonText size="xs" width="w-24" />
                    {/* sparkle icon + score chip */}
                    <div className="mt-2 flex items-center gap-2">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    {/* short feedback line */}
                    <div className="mt-2">
                        <SkeletonText size="sm" width="w-5/6" />
                    </div>
                    {/* processed-time line */}
                    <div className="mt-2">
                        <SkeletonText size="xs" width="w-1/3" />
                    </div>
                </div>
            ))}
        </SurfaceListCard>
    )
}
