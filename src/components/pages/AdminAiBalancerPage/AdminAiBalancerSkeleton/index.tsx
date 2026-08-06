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
                        <StackV gap={4} principle="card-caption" items={[
                            () => (
                                <StackH gap={4} principle="content-row" align="start" justify="between" items={[
                                    () => (
                                        <StackV gap={3} principle="sibling-stack" items={[
                                            () => <Skeleton className="h-5 w-32 rounded" />,
                                            () => <Skeleton className="h-3 w-48 rounded-sm" />,
                                        ]} />
                                    ),
                                    () => (
                                        <Cluster gap={3} principle="chip-row" items={[
                                            () => <Skeleton className="h-6 w-20 rounded-full" />,
                                            () => <Skeleton className="h-6 w-20 rounded-full" />,
                                            () => <Skeleton className="h-6 w-20 rounded-full" />,
                                        ]} />
                                    ),
                                ]} />
                            ),
                            () => (
                                <Box principle="cell-pad" className="rounded-lg border border-white/5">
                                    <StackV gap={3} principle="sibling-stack" items={
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
