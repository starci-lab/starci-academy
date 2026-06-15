"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"

/**
 * Loading placeholder for the voice-interview session. Mirrors the real layout:
 * meta chips, one tall question panel, a centered mic button, and the
 * new-question / submit controls.
 */
export const InterviewSessionSkeleton = () => {
    return (
        <div className="flex flex-col gap-6">
            {/* level + tag chips */}
            <div className="flex gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            {/* the question panel — plain (borderless) surface */}
            <div className="flex min-h-40 flex-col gap-3 rounded-xl bg-default/40 p-8">
                <SkeletonText size="base" width="w-3/4" />
                <SkeletonText size="base" width="w-2/3" />
            </div>
            {/* centered mic button */}
            <div className="flex justify-center">
                <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
            {/* new-question / submit controls */}
            <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-9 w-32 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
        </div>
    )
}
