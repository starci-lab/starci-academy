"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { SkeletonParagraph } from "@/components/blocks/skeleton/SkeletonParagraph"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Loading placeholder for {@link PracticeProblemPage}. Mirrors the real two-pane
 * full-bleed IDE shell exactly (`grid h-[calc(100vh-4rem)] grid-cols-1
 * @app-lg:grid-cols-2`, no Card wrapper, `border-r` divider) so the shell never jumps
 * on resolve: left = back link + tab strip + statement + samples; right =
 * language selector + editor + a bottom console (tabs + action bar).
 */
export const PracticeProblemSkeleton = () => {
    return (
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 @app-lg:grid-cols-2">
            {/* ── LEFT: back + tabs + statement + samples ── */}
            <div className="flex min-h-0 flex-col overflow-hidden border-r border-default">
                <Box principle="page-pad" className="flex flex-col border-b border-default px-6 py-3">
                    <StackV gap={4} principle="card-caption" items={[
                        () => <SkeletonText size="sm" width="w-24" />,
                        () => (
                            <StackH gap={5} principle="group-boundary" items={[
                                () => <SkeletonText size="sm" width="w-16" />,
                                () => <SkeletonText size="sm" width="w-16" />,
                                () => <SkeletonText size="sm" width="w-16" />,
                            ]} />
                        ),
                    ]} />
                </Box>
                <Box principle="page-pad" className="flex flex-col px-6 py-5">
                    <StackV gap={6} principle="block-boundary" items={[
                        () => (
                            <StackV gap={3} principle="sibling-stack" items={[
                                () => <SkeletonText size="xl" width="w-1/2" />,
                                () => <SkeletonText size="sm" width="w-2/3" />,
                            ]} />
                        ),
                        () => <SkeletonParagraph size="sm" lines={6} />,
                        () => (
                            <StackV gap={4} principle="card-caption" items={[
                                () => <Skeleton className="h-20 w-full rounded-2xl" />,
                                () => <Skeleton className="h-20 w-full rounded-2xl" />,
                            ]} />
                        ),
                    ]} />
                </Box>
            </div>

            {/* ── RIGHT: editor + console ── */}
            <div className="flex min-h-0 flex-col overflow-hidden">
                {/* language selector + reset */}
                <Box principle="pill-pad" className="flex flex-wrap items-center justify-between border-b border-default px-4 py-2">
                    <StackH gap={3} principle="flex-action" items={[
                        () => <Skeleton className="h-8 w-20 rounded-xl" />,
                        () => <Skeleton className="h-8 w-20 rounded-xl" />,
                        () => <Skeleton className="h-8 w-20 rounded-xl" />,
                    ]} />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                </Box>

                {/* code editor — fills remaining vertical space */}
                <div className="min-h-0 flex-1">
                    <Skeleton className="h-full w-full" />
                </div>

                {/* bottom console — tabs + action bar */}
                <div className="flex h-[42%] flex-col border-t border-default">
                    <Box principle="row-pad" className="flex items-center border-b border-default px-4 py-3">
                        <StackH gap={5} principle="group-boundary" items={[
                            () => <SkeletonText size="sm" width="w-20" />,
                            () => <SkeletonText size="sm" width="w-20" />,
                        ]} />
                    </Box>
                    <Box principle="cell-pad" className="flex-1 p-3">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </Box>
                    <Box principle="control-pad" className="flex items-center justify-end border-t border-default px-3 py-2">
                        <StackH gap={3} principle="flex-action" items={[
                            () => <Skeleton className="h-8 w-24 rounded-xl" />,
                            () => <Skeleton className="h-8 w-24 rounded-xl" />,
                        ]} />
                    </Box>
                </div>
            </div>
        </div>
    )
}
