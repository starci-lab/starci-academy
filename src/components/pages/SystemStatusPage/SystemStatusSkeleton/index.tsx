import React from "react"
import { Skeleton } from "@heroui/react"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SystemStatusSkeleton}. */
export interface SystemStatusSkeletonProps extends WithClassNames<undefined> {
    /** When true, render only the AI key group mirror (the AI section loads on its own). */
    aiOnly?: boolean
}

/** A single component-card placeholder mirroring {@link ComponentCard}. */
const ComponentCardSkeleton = () => (
    <Box principle="card-padding" className="rounded-large bg-surface p-4 shadow-surface">
        <StackV
            gap={3}
            principle="sibling-stack"
            items={[
                () => (
                    <StackH
                        gap={3}
                        principle="flex-action"
                        align="center"
                        justify="between"
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principle="identity"
                                    align="center"
                                    items={[
                                        () => <Skeleton className="size-2.5 rounded-full" />,
                                        () => <Skeleton className="h-4 w-20 rounded" />,
                                    ]}
                                />
                            ),
                            () => <Skeleton className="h-5 w-16 rounded-full" />,
                        ]}
                    />
                ),
                () => (
                    <StackH
                        gap={3}
                        principle="flex-action"
                        align="center"
                        justify="between"
                        items={[
                            () => <Skeleton className="h-3 w-10 rounded" />,
                            () => <Skeleton className="h-3 w-24 rounded" />,
                        ]}
                    />
                ),
            ]}
        />
    </Box>
)

/** A single AI key group placeholder mirroring {@link AiKeyGroup}. */
const AiKeyGroupSkeleton = () => (
    <Box principle="card-padding" className="rounded-large bg-surface p-4 shadow-surface">
        <StackV
            gap={4}
            principle="label-field"
            items={[
                () => <Skeleton className="h-4 w-2/3 rounded" />,
                () => (
                    <Cluster
                        gap={3}
                        principle="chip-row"
                        items={Array.from({ length: 5 }, (_, index) => () => (
                            <Skeleton key={index} className="h-5 w-20 rounded-full" />
                        ))}
                    />
                ),
            ]}
        />
    </Box>
)

/**
 * Loading mirror for {@link import("../index").SystemStatus}. Matches the real
 * banner + infrastructure grid + AI key group rhythm so the layout never jumps
 * when data resolves. Pass `aiOnly` to mirror just the AI section.
 */
export const SystemStatusSkeleton = ({ aiOnly = false }: SystemStatusSkeletonProps) => {
    if (aiOnly) {
        return (
            <StackV
                gap={4}
                principle="content-row"
                items={Array.from({ length: 2 }, (_, index) => () => (
                    <AiKeyGroupSkeleton key={index} />
                ))}
            />
        )
    }

    const gridItems: Array<GridItem> = Array.from({ length: 6 }, (_, index) => ({
        key: String(index),
        content: () => <ComponentCardSkeleton />,
    }))

    return (
        <StackV
            gap={6}
            principle="block-boundary"
            items={[
                () => <Skeleton className="h-14 w-full rounded-2xl" />,
                () => (
                    <StackV
                        gap={4}
                        principle="label-field"
                        items={[
                            () => <Skeleton className="h-4 w-32 rounded" />,
                            () => (
                                <Grid
                                    columns={{ base: 1, sm: 2, lg: 3 }}
                                    principle="content-row"
                                    items={gridItems}
                                />
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )
}
