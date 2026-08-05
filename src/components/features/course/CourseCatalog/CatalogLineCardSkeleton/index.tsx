"use client"

import React from "react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Loading placeholder for ONE compact "line" catalog row — mirrors
 * {@link import("../CatalogCourseCard").CatalogCourseCard}'s `layout="line"` shape
 * (thumbnail, title + one description line, a price line, and a two-button
 * action row) so the catalog's line view does not jump when data resolves.
 *
 * `CatalogCourseCard` has no `isSkeleton` prop of its own (it wraps the
 * `CourseCard` block, neither of which is in scope for this split), so this is
 * the minimal co-located mirror the loading-and-skeleton.md escape hatch calls
 * for — kept right beside the row it stands in for, not a separate top-level
 * skeleton tree swapped in wholesale.
 */
export const CatalogLineCardSkeleton = () => (
    <SurfaceCard
        identity={{ tier: "block", component: "CatalogLineCardSkeleton" }}
        body={() => (
            <StackH
                gap={4}
                items={[
                    () => (
                        <Skeleton className="hidden aspect-video w-36 shrink-0 rounded-2xl @app-sm:block" />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            classNames={["min-w-0", "flex-1"]}
                            items={[
                                () => <Skeleton.Typography type="h6" width="1/2" />,
                                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                            ]}
                        />
                    ),
                    () => (
                        <StackV
                            gap={2}
                            align="end"
                            classNames={["shrink-0"]}
                            items={[
                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                () => (
                                    <StackH
                                        gap={2}
                                        classNames={["w-full"]}
                                        items={[
                                            () => <Skeleton.Button width="flex-1" />,
                                            () => <Skeleton.Button width="flex-1" />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        )}
    />
)
