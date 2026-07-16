"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Number of placeholder cohort rows shown while the weekly league loads. */
const SKELETON_ROW_COUNT = 8

/** Props for {@link WeeklyBoardSkeleton}. */
export type WeeklyBoardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").WeeklyBoard}: mirrors the tier
 * badge + reset countdown row, the promote/demote legend, and N ranked rows
 * [rank · avatar · name · points · caret] — so the board does not jump when
 * the cohort resolves.
 *
 * @param props - {@link WeeklyBoardSkeletonProps}
 */
export const WeeklyBoardSkeleton = ({ className }: WeeklyBoardSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* tier badge + reset countdown */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-6 shrink-0 rounded-full" />
                    <Skeleton.Typography type="body-sm" width="1/3" />
                </div>
                <Skeleton.Typography type="body-xs" width="1/4" />
            </div>

            {/* promote / demote legend */}
            <div className="flex items-center gap-3">
                <Skeleton.Typography type="body-xs" width="1/4" />
                <Skeleton.Typography type="body-xs" width="1/4" />
            </div>

            {/* full cohort rows — mirror LeagueRow [rank · avatar · name · points · caret] */}
            <div className="flex flex-col gap-2">
                {Array.from({ length: SKELETON_ROW_COUNT }).map((_row, index) => (
                    <div
                        key={index}
                        className="flex w-full items-center gap-2 rounded-3xl p-2"
                    >
                        <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />
                        <Skeleton.Avatar size="sm" />
                        <Skeleton.Typography type="body-sm" width="1/3" className="min-w-0 flex-1" />
                        <Skeleton className="h-3 w-8 shrink-0 rounded-sm" />
                        <Skeleton className="h-3 w-8 shrink-0 rounded-sm" />
                    </div>
                ))}
            </div>
        </div>
    )
}
