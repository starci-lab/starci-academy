"use client"

import React from "react"
import { Skeleton } from "@heroui/react"

/**
 * Loading placeholder for one {@link import("../JobListRow").JobListRow} —
 * mirrors the logo tile + title/company/meta + salary/time layout so the list
 * never collapses or jumps on resolve.
 */
export const JobListRowSkeleton = () => {
    return (
        <div className="flex items-center gap-3 rounded-3xl bg-surface px-4 py-4 shadow-surface">
            <Skeleton className="size-12 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/2 rounded-lg" />
                <Skeleton className="h-3 w-1/3 rounded-lg" />
                <Skeleton className="h-3 w-1/4 rounded-lg" />
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
                <Skeleton className="h-4 w-16 rounded-lg" />
                <Skeleton className="h-3 w-12 rounded-lg" />
            </div>
        </div>
    )
}
