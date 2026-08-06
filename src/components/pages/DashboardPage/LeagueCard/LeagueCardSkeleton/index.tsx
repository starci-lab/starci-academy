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
import { StackH, StackV } from "@/components/frames/Stack"

/** Number of placeholder cohort rows (mirrors the capped top rows). */
const SKELETON_ROWS = 5

/** Props for {@link LeagueCardSkeleton}. */
export type LeagueCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").LeagueCard} — mirrors the real
 * `LeaderboardListCard`: label + a standing header (IconTile medal badge + primary +
 * secondary line) + a `bordered` `SurfaceListCard` of rows
 * [rank slot · avatar size-8 · name · XP value · caret]. (Was wrong: a plain Card
 * with loose size-6 rows, no rank slot, no badge, no value.)
 * @param props - {@link LeagueCardSkeletonProps}
 */
export const LeagueCardSkeleton = ({ className }: LeagueCardSkeletonProps) => (
    <div className={cn(className)}>
        <StackV gap={3} principle="sibling-stack" items={[
            () => <Skeleton.Typography type="body-sm" width="1/3" />,
            () => (
                <StackH gap={4} principle="content-row" align="center" items={[
                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                    () => (
                        <StackV gap={2} principle="title-subtitle" classNames={["min-w-0", "flex-1"]} items={[
                            () => <Skeleton.Typography type="body-sm" width="1/2" />,
                            () => <Skeleton.Typography type="body-xs" width="1/3" />,
                        ]} />
                    ),
                ]} />
            ),
            () => (
                <SurfaceListCard bordered>
                    {Array.from({ length: SKELETON_ROWS }).map((_row, index) => (
                        <SurfaceListCardItem key={index}>
                            <StackH gap={4} principle="content-row" align="center" items={[
                                () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                                () => <Skeleton.Avatar size="sm" />,
                                () => <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />,
                                () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                                () => <Skeleton className="h-4 w-8 shrink-0 rounded-sm" />,
                            ]} />
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            ),
        ]} />
    </div>
)
