"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
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
                <Box principle="page-pad" className="flex flex-col border-b border-default px-6 py-3"
                    explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                    <StackV principle="card-caption"
                        explain="Holds caption text under card media so the caption stays attached to the image above it."
                        items={[
                            () => <SkeletonText size="sm" width="w-24" />,
                            () => (
                                <StackH principle="group-boundary"
                                    explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                                    items={[
                                        () => <SkeletonText size="sm" width="w-16" />,
                                        () => <SkeletonText size="sm" width="w-16" />,
                                        () => <SkeletonText size="sm" width="w-16" />,
                                    ]} />
                            ),
                        ]} />
                </Box>
                <Box principle="page-pad" className="flex flex-col px-6 py-5"
                    explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                    <StackV principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        items={[
                            () => (
                                <StackV principle="sibling-stack"
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    items={[
                                        () => <SkeletonText size="xl" width="w-1/2" />,
                                        () => <SkeletonText size="sm" width="w-2/3" />,
                                    ]} />
                            ),
                            () => <SkeletonParagraph size="sm" lines={6} />,
                            () => (
                                <StackV principle="card-caption"
                                    explain="Holds caption text under card media so the caption stays attached to the image above it."
                                    items={[
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
                <Box principle="pill-pad" className="flex flex-wrap items-center justify-between border-b border-default px-4 py-2"
                    explain="Pill/chip inset — not control-pad, because this pads a compact badge shape rather than a form control.">
                    <StackH principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        items={[
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
                    <Box principle="row-pad" className="flex items-center border-b border-default px-4 py-3"
                        explain="Row content inset — not cell-pad, because this pads a horizontal content row rather than a dense table cell.">
                        <StackH principle="group-boundary"
                            explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                            items={[
                                () => <SkeletonText size="sm" width="w-20" />,
                                () => <SkeletonText size="sm" width="w-20" />,
                            ]} />
                    </Box>
                    <Box principle="cell-pad" className="flex-1 p-3"
                        explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body.">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </Box>
                    <Box principle="control-pad" className="flex items-center justify-end border-t border-default px-3 py-2"
                        explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.">
                        <StackH principle="flex-action"
                            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                            items={[
                                () => <Skeleton className="h-8 w-24 rounded-xl" />,
                                () => <Skeleton className="h-8 w-24 rounded-xl" />,
                            ]} />
                    </Box>
                </div>
            </div>
        </div>
    )
}
