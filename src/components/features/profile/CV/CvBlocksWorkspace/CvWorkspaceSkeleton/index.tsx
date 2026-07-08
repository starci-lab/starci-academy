"use client"

import React from "react"
import { Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CvWorkspaceSkeleton}. */
export type CvWorkspaceSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../index").CvBlocksWorkspace} —
 * mirrors the document tabs → toolbar → split-pane layout so the shell never
 * collapses/jumps once `myCvBlocks` resolves.
 *
 * @param props - {@link CvWorkspaceSkeletonProps}
 */
export const CvWorkspaceSkeleton = ({ className }: CvWorkspaceSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Skeleton className="h-10 w-full max-w-md rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-2xl lg:h-[75vh]" />
            </div>
        </div>
    )
}
