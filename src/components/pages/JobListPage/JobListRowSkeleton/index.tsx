"use client"

import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Loading placeholder for one {@link import("../JobListRow").JobListRow} — a
 * {@link SurfaceListCardItem} row body (the parent {@link
 * import("@/components/blocks/cards/SurfaceListCard").SurfaceListCard} owns the
 * joined card + full-bleed separators). Mirrors the logo tile + title/company/meta
 * + salary/time layout so the list never collapses or jumps on resolve.
 */
export const JobListRowSkeleton = () => {
    return (
        <SurfaceListCardItem>
            <StackH
                gap={4}
                principle="content-row"
                align="center"
                items={[
                    () => <Skeleton className="size-12 shrink-0 rounded-xl" />,
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                () => <Skeleton.Typography type="body-xs" width="1/3" />,
                                () => (
                                    <Cluster
                                        gap={3}
                                        principle="chip-row"
                                        items={[
                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                            () => <Skeleton.Chip />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            principle="title-subtitle"
                            align="end"
                            classNames={["shrink-0"]}
                            items={[
                                () => <Skeleton.Typography type="body-sm" width="full" className="w-16" />,
                                () => <Skeleton.Typography type="body-xs" width="full" className="w-12" />,
                            ]}
                        />
                    ),
                ]}
            />
        </SurfaceListCardItem>
    )
}
