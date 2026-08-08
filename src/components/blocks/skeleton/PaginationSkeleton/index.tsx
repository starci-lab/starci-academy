"use client"

import React, { useMemo } from "react"
import { Skeleton } from "@heroui/react"
import { Cluster } from "@/components/frames/Cluster"

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
    const items = useMemo(
        () => [
            () => <Skeleton className="size-8 rounded-lg" />,
            ...Array.from({ length: pageCount }, () => () => (
                <Skeleton className="size-8 rounded-lg" />
            )),
            () => <Skeleton className="size-8 rounded-lg" />,
        ],
        [pageCount],
    )

    return (
        <Cluster
            identity={{ tier: "block", component: "PaginationSkeleton" }}
            principle="chip-row"
            explain="Prev/page/next skeleton pills share one wrapping control row — not flex-action, because these are placeholders for pagination affordances not live buttons."
            items={items}
        />
    )
}
