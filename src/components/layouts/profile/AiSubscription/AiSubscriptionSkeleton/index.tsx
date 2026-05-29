"use client"

import React from "react"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    cn,
} from "@heroui/react"
import {
    FreeTierCardSkeleton,
} from "../FreeTierCardSkeleton"
import {
    TierCardSkeleton,
} from "../TierGrid/TierCardSkeleton"

export type AiSubscriptionSkeletonProps = WithClassNames<undefined>

/**
 * Loading state for the {@link AiSubscription} tier grid.
 *
 * Presentational: mirrors only the tier grid (free + three paid cards, middle
 * card includes popular chip slot). Breadcrumb + header are static chrome and
 * render outside the loading gate, so they are intentionally not skeletonized.
 * @param props.className - Optional wrapper class.
 */
export const AiSubscriptionSkeleton = ({
    className,
}: AiSubscriptionSkeletonProps) => {
    return (
        <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)}>
            <FreeTierCardSkeleton />
            <TierCardSkeleton />
            <TierCardSkeleton />
            <TierCardSkeleton />
        </div>
    )
}
