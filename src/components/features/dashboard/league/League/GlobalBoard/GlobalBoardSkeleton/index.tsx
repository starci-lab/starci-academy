"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Number of placeholder rows shown while the global leaderboard loads. */
const SKELETON_ROW_COUNT = 8

/** Props for {@link GlobalBoardSkeleton}. */
export type GlobalBoardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").GlobalBoard}: mirrors the
 * subtitle + viewer-rank row and N rows shaped like the real global row
 * [rank · avatar · name · points] — so the board does not jump when the
 * leaderboard resolves.
 *
 * @param props - {@link GlobalBoardSkeletonProps}
 */
export const GlobalBoardSkeleton = ({ className }: GlobalBoardSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* subtitle + the viewer's own standing */}
            <div className="flex items-center justify-between gap-3">
                <Skeleton.Typography type="body-xs" width="1/3" />
                <Skeleton.Typography type="body-sm" width="1/4" />
            </div>

            {/* the global top N */}
            <div className="flex flex-col gap-2">
                {Array.from({ length: SKELETON_ROW_COUNT }).map((_row, index) => (
                    <div
                        key={index}
                        className="flex w-full items-center gap-2 rounded-3xl p-2"
                    >
                        <Skeleton className="h-3 w-8 shrink-0 rounded-sm" />
                        <Skeleton.Avatar size="sm" />
                        <Skeleton.Typography type="body-sm" width="1/3" className="min-w-0 flex-1" />
                        <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
                    </div>
                ))}
            </div>
        </div>
    )
}
