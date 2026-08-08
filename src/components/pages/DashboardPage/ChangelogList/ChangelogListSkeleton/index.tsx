"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"

/** Representative changelog rows shown while entries load. */
const SKELETON_ROW_COUNT = 4

/**
 * Loading placeholder for {@link import("../").ChangelogList}: mirrors the surface
 * list card — each row a meta line (date + category chip) over a title and body
 * line — so the loaded list does not jump in.
 */
export const ChangelogListSkeleton = () => {
    const items: Array<SurfaceCardListItem> = Array.from(
        { length: SKELETON_ROW_COUNT },
        (_unused, index) => ({
            key: `skeleton-${index}`,
            content: () => (
                <StackV gap={3} principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={[
                        () => (
                            <StackH gap={3} principle="flex-action"
                                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                align="center" items={[
                                    () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                    () => <Skeleton className="h-4 w-16 shrink-0 rounded-full" />,
                                ]} />
                        ),
                        () => <Skeleton.Typography type="body-sm" width="3/4" />,
                        () => <Skeleton.Typography type="body-sm" width="1/2" />,
                    ]} />
            ),
        }),
    )

    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "ChangelogListSkeleton" }}
            items={items}
        />
    )
}
