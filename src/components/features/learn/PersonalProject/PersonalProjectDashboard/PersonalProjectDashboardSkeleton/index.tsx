"use client"

import React from "react"
import { Skeleton, cn } from "@heroui/react"
import { SkeletonText } from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link PersonalProjectDashboardSkeleton}. */
export type PersonalProjectDashboardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link import("../").PersonalProjectDashboard}. Mirrors
 * the real layout 1:1: the 3-up KPI card grid (label + card body) over the 4-stat
 * ribbon, so nothing jumps when the milestones + progress land.
 * @param props - optional className for the root element
 */
export const PersonalProjectDashboardSkeleton = ({
    className,
}: PersonalProjectDashboardSkeletonProps = {}) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* 3-up KPI cards (label above a card body) */}
            <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                    <div key={`pp-dash-card-${index}`} className="flex flex-col gap-3">
                        <SkeletonText size="sm" width="w-24" />
                        <Skeleton className="h-[92px] w-full rounded-xl" />
                    </div>
                ))}
            </div>
            {/* 4-stat ribbon */}
            <div className="flex flex-wrap gap-6 border-t border-default-200 pt-3">
                {Array.from({ length: 4 }, (_, index) => (
                    <div key={`pp-dash-stat-${index}`} className="flex flex-col gap-1">
                        <Skeleton className="h-5 w-10 rounded" />
                        <Skeleton className="h-3 w-14 rounded-sm" />
                    </div>
                ))}
            </div>
        </div>
    )
}
