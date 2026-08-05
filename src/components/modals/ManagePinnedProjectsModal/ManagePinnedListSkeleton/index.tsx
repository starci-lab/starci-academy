import React from "react"
import {
    Card,
    CardContent,
} from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Rows shown while the owner's pinned list is first loading. */
const SKELETON_ROW_COUNT = 3

/**
 * Loading mirror for the "manage" tab's pin list. `PinnedProjectCard` composes the
 * {@link MediaCard} block, which has no `isSkeleton` of its own to thread through —
 * so per `loading-and-skeleton.md` §5 this stands as its own co-located skeleton
 * component (the LEGACY hand-built mirror carve-out for a region with no leaf
 * tree of its own to shimmer) instead of a prop reaching into `MediaCard`.
 *
 * Mirrors `MediaCard` (manage mode) row-for-row: cover · title · meta chip row ·
 * description · footer of 4 icon-only action buttons.
 */
export const ManagePinnedListSkeleton = () => (
    <div className="flex flex-col gap-3">
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            <Card key={index} className="gap-0 overflow-hidden p-0">
                <Skeleton className="aspect-video w-full" />
                <CardContent className="flex flex-col gap-3 px-4 pb-4 pt-3">
                    <Skeleton.Typography width="1/2" />
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton.Chip />
                        <Skeleton.Chip />
                    </div>
                    <Skeleton.Typography type="body-sm" width="full" />
                    <Skeleton.Typography type="body-sm" width="2/3" />
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 4 }).map((__, buttonIndex) => (
                            <Skeleton key={buttonIndex} className="size-9 shrink-0 rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
)
