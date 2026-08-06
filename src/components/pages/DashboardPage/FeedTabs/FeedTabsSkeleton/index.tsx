"use client"

import React from "react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { StackH, StackV } from "@/components/frames/Stack"

/** Date-grouped activity rows shown while the feed loads. */
const SKELETON_GROUP_COUNT = 2

/** Placeholder activity rows per date group. */
const SKELETON_ROW_COUNT = 3

/** Props for {@link FeedTabsSkeleton}. */
export type FeedTabsSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for the explore activity feed inside {@link import("../").FeedTabs}:
 * mirrors the real {@link import("@/components/blocks").ActivityFeed} — each day is a
 * labeled surface card (date label + joined rows of [avatar · two text lines]) — so the
 * feed card does not collapse / jump on resolve.
 *
 * @param props - {@link FeedTabsSkeletonProps}
 */
export const FeedTabsSkeleton = ({ className }: FeedTabsSkeletonProps) => {
    return (
        <div className={className}>
            <StackV gap={6} principle="block-boundary" items={
                Array.from({ length: SKELETON_GROUP_COUNT }, (_group, groupIndex) => () => (
                    // mirrors LabeledCard frameless (date label, gap-3) → SurfaceListCard bordered
                    <StackV key={groupIndex} gap={4} principle="label-field" items={[
                        () => <Skeleton.Typography type="body-xs" width="1/4" />,
                        () => (
                            <SurfaceListCard>
                                {Array.from({ length: SKELETON_ROW_COUNT }).map((_row, rowIndex) => (
                                    <SurfaceListCardItem key={rowIndex}>
                                        <StackH gap={3} principle="identity" align="start" items={[
                                            () => <Skeleton className="size-9 shrink-0 rounded-full" />,
                                            () => (
                                                <StackV gap={1} principle="name-handle" classNames={["flex-1"]} items={[
                                                    () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                                    () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                ]} />
                                            ),
                                        ]} />
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
                        ),
                    ]} />
                ))
            } />
        </div>
    )
}
