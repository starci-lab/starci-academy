"use client"

import React, { useMemo } from "react"
import { Skeleton } from "@heroui/react"

/** Props for {@link PaginationSkeleton}. */
export interface PaginationSkeletonProps {
    /** Number of page-number pill placeholders between prev/next. */
    pageCount?: number
}

/**
 * Loading placeholder for a centered HeroUI {@link Pagination} row.
 *
 * Mirrors the `sm` pagination layout: previous control, page links, next control.
 *
 * @param props.pageCount - Page pill count (defaults to 3).
 */
export const PaginationSkeleton = ({
    pageCount = 3,
}: PaginationSkeletonProps) => {
    const pageIndexes = useMemo(
        () => Array.from({ length: pageCount }, (_, index) => index),
        [pageCount],
    )

    return (
        <div className="flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-1">
                <Skeleton className="size-8 rounded-lg" />
                {pageIndexes.map((index) => (
                    <Skeleton key={index} className="size-8 rounded-lg" />
                ))}
                <Skeleton className="size-8 rounded-lg" />
            </div>
        </div>
    )
}
