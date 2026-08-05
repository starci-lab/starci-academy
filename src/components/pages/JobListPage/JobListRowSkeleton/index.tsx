"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"

/**
 * Loading placeholder for one {@link import("../JobListRow").JobListRow} — a
 * {@link SurfaceListCardItem} row body (the parent {@link
 * import("@/components/blocks/cards/SurfaceListCard").SurfaceListCard} owns the
 * joined card + full-bleed separators). Mirrors the logo tile + title/company/meta
 * + salary/time layout so the list never collapses or jumps on resolve.
 */
export const JobListRowSkeleton = () => {
    return (
        <SurfaceListCardItem>
            <div className="flex items-center gap-3">
                {/* IconTile (size="sm" → size-12 rounded-xl) */}
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton.Typography type="body-sm" width="1/2" />
                    <Skeleton.Typography type="body-xs" width="1/3" />
                    <div className="flex flex-wrap items-center gap-2">
                        <Skeleton.Typography type="body-xs" width="1/4" />
                        <Skeleton.Chip />
                    </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                    <Skeleton.Typography type="body-sm" width="full" className="w-16" />
                    <Skeleton.Typography type="body-xs" width="full" className="w-12" />
                </div>
            </div>
        </SurfaceListCardItem>
    )
}
