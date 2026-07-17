"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { SkeletonParagraph } from "@/components/blocks/skeleton/SkeletonParagraph"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"

/**
 * Loading placeholder for {@link PracticeProblem}. Mirrors the real two-pane
 * full-bleed IDE shell exactly (`grid h-[calc(100vh-4rem)] grid-cols-1
 * lg:grid-cols-2`, no Card wrapper, `border-r` divider) so the shell never jumps
 * on resolve: left = back link + tab strip + statement + samples; right =
 * language selector + editor + a bottom console (tabs + action bar).
 */
export const PracticeProblemSkeleton = () => {
    return (
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
            {/* ── LEFT: back + tabs + statement + samples ── */}
            <div className="flex min-h-0 flex-col overflow-hidden border-r border-default">
                <div className="flex flex-col gap-3 border-b border-default px-6 py-3">
                    <SkeletonText size="sm" width="w-24" />
                    <div className="flex items-center gap-4">
                        <SkeletonText size="sm" width="w-16" />
                        <SkeletonText size="sm" width="w-16" />
                        <SkeletonText size="sm" width="w-16" />
                    </div>
                </div>
                <div className="flex flex-col gap-6 px-6 py-5">
                    <div className="flex flex-col gap-2">
                        <SkeletonText size="xl" width="w-1/2" />
                        <SkeletonText size="sm" width="w-2/3" />
                    </div>
                    <SkeletonParagraph size="sm" lines={6} />
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* ── RIGHT: editor + console ── */}
            <div className="flex min-h-0 flex-col overflow-hidden">
                {/* language selector + reset */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-default px-4 py-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded-xl" />
                        <Skeleton className="h-8 w-20 rounded-xl" />
                        <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-xl" />
                </div>

                {/* code editor — fills remaining vertical space */}
                <div className="min-h-0 flex-1">
                    <Skeleton className="h-full w-full" />
                </div>

                {/* bottom console — tabs + action bar */}
                <div className="flex h-[42%] flex-col border-t border-default">
                    <div className="flex items-center gap-4 border-b border-default px-4 py-3">
                        <SkeletonText size="sm" width="w-20" />
                        <SkeletonText size="sm" width="w-20" />
                    </div>
                    <div className="flex-1 p-3">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-default px-3 py-2">
                        <Skeleton className="h-8 w-24 rounded-xl" />
                        <Skeleton className="h-8 w-24 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
