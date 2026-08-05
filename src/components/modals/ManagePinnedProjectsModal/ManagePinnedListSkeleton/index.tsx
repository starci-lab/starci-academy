import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"

/** Rows shown while the owner's pinned list is first loading. */
const SKELETON_ROW_COUNT = 3

/** Icon-only footer actions a manage-mode card shows (move-up, move-down, open, remove). */
const SKELETON_BUTTON_COUNT = 4

/**
 * Loading mirror for the "manage" tab's pin list. `PinnedProjectCard` composes the
 * {@link MediaCard} block, which has no `isSkeleton` of its own to thread through —
 * so per `loading-and-skeleton.md` §5 this stands as its own co-located skeleton
 * component (the LEGACY hand-built mirror carve-out for a region with no leaf
 * tree of its own to shimmer) instead of a prop reaching into `MediaCard`.
 *
 * Mirrors `MediaCard` (manage mode) row-for-row: cover · title · meta chip row ·
 * description · footer of 4 icon-only action buttons. The card chrome comes from
 * the `Box` frame's `className="card"` escape hatch (border/radius/shadow are
 * appearance a frame deliberately can't carry); every row inside is a real
 * `Skeleton.*`/`Button` shimmer, laid out with `StackV`/`Cluster`.
 */
export const ManagePinnedListSkeleton = () => (
    <StackV
        gap={4}
        items={Array.from({ length: SKELETON_ROW_COUNT }).map(() => () => (
            <Box className="card">
                <StackV
                    gap={4}
                    items={[
                        () => <Skeleton className="aspect-video w-full rounded-xl" />,
                        () => <Skeleton.Typography width="1/2" />,
                        () => (
                            <Cluster
                                gap={3}
                                items={[
                                    () => <Skeleton.Chip />,
                                    () => <Skeleton.Chip />,
                                ]}
                            />
                        ),
                        () => <Skeleton.Typography type="body-sm" width="full" />,
                        () => <Skeleton.Typography type="body-sm" width="2/3" />,
                        () => (
                            <Cluster
                                gap={3}
                                items={Array.from({ length: SKELETON_BUTTON_COUNT }).map(() => () => (
                                    <Button isSkeleton isIconOnly size="sm" />
                                ))}
                            />
                        ),
                    ]}
                />
            </Box>
        ))}
    />
)
