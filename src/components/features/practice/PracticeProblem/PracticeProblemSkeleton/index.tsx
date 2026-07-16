"use client"

import React from "react"
import { Skeleton } from "@heroui/react"
import { SkeletonParagraph } from "@/components/blocks/skeleton/SkeletonParagraph"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"

/**
 * Loading placeholder for {@link PracticeProblem}. Mirrors the real two-pane
 * full-bleed workspace shell exactly (`grid h-[calc(100vh-4rem)] grid-cols-1
 * lg:grid-cols-2`, no Card wrapper, `border-r` divider between panes) so the
 * shell never jumps on resolve: left = header + statement + sample testcases;
 * right = language selector + code editor + submit bar.
 */
export const PracticeProblemSkeleton = () => {
    return (
        <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
            {/* ── LEFT: statement + samples ── */}
            <div className="flex flex-col overflow-y-auto border-r">
                {/* problem header */}
                <div className="flex items-center justify-between gap-3 border-b px-6 py-4">
                    <SkeletonText size="xl" width="w-1/2" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <SkeletonText size="sm" width="w-16" />
                    </div>
                </div>

                {/* statement body */}
                <div className="flex flex-col gap-6 px-6 py-5">
                    <SkeletonParagraph size="sm" lines={6} />

                    {/* sample testcases */}
                    <div className="flex flex-col gap-3">
                        <div className="border-t" />
                        <SkeletonText size="base" width="w-24" />
                        <Skeleton className="h-20 w-full rounded-medium" />
                        <Skeleton className="h-20 w-full rounded-medium" />
                    </div>
                </div>
            </div>

            {/* ── RIGHT: editor + submit ── */}
            <div className="flex flex-col overflow-y-auto">
                {/* language selector */}
                <div className="flex flex-wrap items-center gap-2 border-b px-6 py-3">
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                    <Skeleton className="h-8 w-20 rounded-xl" />
                </div>

                {/* code editor — fills remaining vertical space */}
                <div className="flex-1 border-b">
                    <Skeleton className="h-full w-full" />
                </div>

                {/* submit bar */}
                <div className="flex items-center justify-end border-b px-6 py-3">
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
