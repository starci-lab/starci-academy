"use client"

import React from "react"
import {
    Separator,
    Skeleton,
} from "@heroui/react"

/**
 * Loading placeholder for the milestone task detail panel.
 *
 * Presentational: static skeleton rows, no props or logic.
 */
export const TaskSkeleton = () => {
    return (
        <>
            <Separator />
            <div className="p-3">
                <Skeleton className="h-[18px] w-2/3 rounded my-[5px]" />
                <div className="flex flex-col mt-2">
                    <Skeleton className="h-[14px] w-full rounded-sm my-[3px]" />
                    <Skeleton className="h-[14px] w-2/3 rounded-sm my-[3px]" />
                    <Skeleton className="h-[14px] w-1/2 rounded-sm my-[3px]" />
                </div>
                <div className="h-3" />
                <Skeleton className="h-4 my-1 rounded w-1/2" />
                <div className="rounded-3xl p-3 bg-surface">
                    {Array.from({ length: 3 }, (_, index) => (
                        <React.Fragment key={`task-criteria-skeleton-${index}`}>
                            <div className="p-3">
                                <Skeleton className="h-[14px] w-2/3 my-[3px]" />
                            </div>
                            <Separator className="last:hidden" />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    )
}
