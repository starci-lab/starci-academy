"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/**
 * Placeholder for the content header (breadcrumb, title, description, meta chips)
 * shown while the content entity is loading.
 *
 * Presentational: static skeleton, no props or logic. Mirrors {@link ContentHeader}
 * via {@link PageHeader} — a breadcrumb line above an H3 title + a description +
 * a meta row of three items (read badge · reading-time chip · challenge count) —
 * so the layout does not shift when data arrives.
 */
export const ContentHeaderSkeleton = () => {
    return (
        // mirror PageHeader: breadcrumb ↔ title-block ↔ meta at gap-3; title ↔ description gap-2
        <div className="flex flex-col gap-3">
            <Skeleton.Breadcrumbs count={4} />
            <div className="flex flex-col gap-2">
                <Skeleton.Typography type="h3" width="1/2" />
                <Skeleton.Paragraph lines={2} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Skeleton.Chip />
                <Skeleton.Chip />
                <Skeleton.Typography type="body-xs" width="1/4" />
            </div>
        </div>
    )
}
