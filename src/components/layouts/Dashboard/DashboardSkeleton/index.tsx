"use client"

import React from "react"
import {
    Skeleton,
} from "@heroui/react"

/**
 * Loading placeholder for the GitHub-style dashboard: a narrow left rail
 * (identity + history) and a wider feed column. Uses HeroUI `Skeleton`.
 */
export const DashboardSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 w-32 rounded-medium" />
                </div>
                <Skeleton className="h-9 w-full rounded-medium" />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="h-4 w-full rounded-medium"
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 py-3"
                    >
                        <Skeleton className="size-8 rounded-full" />
                        <div className="flex flex-1 flex-col gap-2">
                            <Skeleton className="h-4 w-2/3 rounded-medium" />
                            <Skeleton className="h-3 w-24 rounded-medium" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
