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

/** Number of placeholder rows (mirrors the loaded top-N). */
const SKELETON_ROWS = 5

/** Props for {@link TopLearnersSkeleton}. */
export type TopLearnersSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").TopLearners} — mirrors the real
 * `LeaderboardListCard`: label + a standing header (IconTile medal badge + primary +
 * secondary line) + a `bordered` `SurfaceListCard` of rows
 * [rank slot · avatar size-8 · name · XP value · follow]. (Was wrong: single-line
 * standing with no badge, rows missing the rank slot + XP value.)
 * @param props - {@link TopLearnersSkeletonProps}
 */
export const TopLearnersSkeleton = ({ className }: TopLearnersSkeletonProps) => (
    <div className={cn(className)}>
        <StackV gap={3} principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            items={[
                () => <Skeleton.Typography type="body-sm" width="1/3" />,
                () => (
                    <StackH gap={4} principle="content-row"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        align="center" items={[
                            () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                            () => (
                                <StackV gap={2} principle="title-subtitle"
                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                    classNames={["min-w-0", "flex-1"]} items={[
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
                                <StackH gap={4} principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                    align="center" items={[
                                        () => <Skeleton className="h-3 w-6 shrink-0 rounded-sm" />,
                                        () => <Skeleton.Avatar size="sm" />,
                                        () => <Skeleton.Typography type="body-sm" width="1/2" className="min-w-0 flex-1" />,
                                        () => <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />,
                                        () => <Skeleton className="h-8 w-24 shrink-0 rounded-xl" />,
                                    ]} />
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                ),
            ]} />
    </div>
)
