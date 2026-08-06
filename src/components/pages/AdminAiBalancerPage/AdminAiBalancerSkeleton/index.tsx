"use client"

import React from "react"
import {
    Card,
    CardContent,
    Skeleton,
    cn,
} from "@heroui/react"
import { StackH, StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { Box } from "@/components/frames/Box"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link AdminAiBalancerSkeleton}. */
export interface AdminAiBalancerSkeletonProps extends WithClassNames<undefined> {
    /** Number of placeholder provider sections. Defaults to `3`. */
    count?: number
}

/**
 * Loading placeholder for {@link AdminAiBalancerPage}. Mirrors the provider sections:
 * a glass card with a provider heading + summary pills and a few key-table rows.
 * @param props - {@link AdminAiBalancerSkeletonProps}
 */
export const AdminAiBalancerSkeleton = ({
    count = 3,
    className,
}: AdminAiBalancerSkeletonProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {Array.from({ length: Math.max(count, 1) }).map((_unused, cardIndex) => (
                <Card
                    key={cardIndex}
                    className="border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    {/* ps-admin-1: p-5 has no house token (dropped from padding scale) — teacher-hold */}
                    <CardContent data-principle="ps-admin-1" className="p-5">
                        <StackV gap={4} principle="card-caption"
                            explain="Holds caption text under card media so the caption stays attached to the image above it."
                            items={[
                                () => (
                                    <StackH gap={4} principle="content-row" align="start" justify="between"
                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                        items={[
                                            () => (
                                                <StackV gap={3} principle="sibling-stack"
                                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                    items={[
                                                        () => <Skeleton className="h-5 w-32 rounded" />,
                                                        () => <Skeleton className="h-3 w-48 rounded-sm" />,
                                                    ]} />
                                            ),
                                            () => (
                                                <Cluster gap={3} principle="chip-row"
                                                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                    items={[
                                                        () => <Skeleton className="h-6 w-20 rounded-full" />,
                                                        () => <Skeleton className="h-6 w-20 rounded-full" />,
                                                        () => <Skeleton className="h-6 w-20 rounded-full" />,
                                                    ]} />
                                            ),
                                        ]} />
                                ),
                                () => (
                                    <Box principle="cell-pad" className="rounded-lg border border-white/5"
                                        explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
                                    >
                                        <StackV gap={3} principle="sibling-stack"
                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                            items={
                                                Array.from({ length: 3 }).map((_unusedRow, rowIndex) =>
                                                    () => <Skeleton key={rowIndex} className="h-8 w-full rounded-lg" />,
                                                )
                                            } />
                                    </Box>
                                ),
                            ]} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
