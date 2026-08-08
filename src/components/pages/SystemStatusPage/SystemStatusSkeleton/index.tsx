import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
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
    <Box principle="card-padding" className="rounded-large bg-surface p-4 shadow-surface"
        explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
        <StackV
            principle="sibling-stack"
            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
            items={[
                () => (
                    <StackH
                        principle="flex-action-between"
                        explain="Identity and status chip shoved apart on one control row — not plain flex-action, because the status reads as the trailing commit."
                        items={[
                            () => (
                                <StackH
                                    principle="identity"
                                    explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
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
                        principle="flex-action-between"
                        explain="Latency and checked-ago meta shoved apart on one control row — not plain flex-action, because the pair reads as escape/commit ends."
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
    <Box principle="card-padding" className="rounded-large bg-surface p-4 shadow-surface"
        explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
        <StackV
            principle="label-field"
            explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
            items={[
                () => <Skeleton className="h-4 w-2/3 rounded" />,
                () => (
                    <Cluster
                        gap={3}
                        principle="chip-row"
                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
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
            <StackV identity={{ tier: "page", component: "SystemStatusSkeleton" }}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
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
        <StackV identity={{ tier: "page", component: "SystemStatusSkeleton" }}
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            items={[
                () => <Skeleton className="h-14 w-full rounded-2xl" />,
                () => (
                    <StackV
                        principle="label-field"
                        explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                        items={[
                            () => <Skeleton className="h-4 w-32 rounded" />,
                            () => (
                                <Grid
                                    columns={{ base: 1, sm: 2, lg: 3 }}
                                    principle="content-row"
                                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
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
