import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Container } from "@/components/frames/Container"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Loading placeholder for {@link import("./index").FlashcardSessionStats} — mirrors its
 * REAL layout tree: HERO `SectionCard` holds ONLY the 4 grade-distribution rows
 * (label · meter · count) + a rollup line (its title/subtitle live in the PageHeader
 * OUTSIDE this AsyncContent), then the metric tiles (`Skeleton.Metric` grid) and the
 * weak-tags `SurfaceListCard`, so the surface never collapses or jumps when the stats
 * query resolves. Used on the revisit-by-URL path (skeleton → stats).
 */
export const FlashcardSessionStatsSkeleton = () => {
    return (
        <Container
            size="md"
            padding={1}
            body={() => (
                <StackV
                    gap={6}
                    items={[
                        () => (
                            <SectionCard contentGap={5}>
                                <StackV
                                    gap={4}
                                    principle="sibling-stack"
                                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                    items={[
                                        ...Array.from({ length: 4 }, (_unused, index) => () => (
                                            <StackH
                                                key={index}
                                                gap={4}
                                                principle="content-row"
                                                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                align="center"
                                                items={[
                                                    () => <Skeleton className="h-[14px] w-16 shrink-0 rounded" />,
                                                    () => <Skeleton.ProgressBar className="flex-1" />,
                                                    () => <Skeleton className="h-[14px] w-16 shrink-0 rounded" />,
                                                ]}
                                            />
                                        )),
                                        () => <Skeleton.Typography type="body-xs" width="1/2" />,
                                    ]}
                                />
                            </SectionCard>
                        ),
                        () => (
                            <StackV
                                as="section"
                                gap={4}
                                principle="label-field"
                                explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                items={[
                                    () => <Skeleton className="h-[14px] w-28 rounded" />,
                                    () => (
                                        // teacher-hold: flashcards-remain-session-stats-metric-grid-gap4-no-token —
                                        // four metric tiles at preserved step 4; no card-grid token.
                                        <Grid
                                            principle="content-row"
                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                            columns={{ base: 2, md: 4 }}
                                            items={Array.from({ length: 4 }).map((_unused, index) => ({
                                                key: `metric-${index}`,
                                                content: () => <Skeleton.Metric />,
                                            }))}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackV
                                as="section"
                                gap={4}
                                principle="label-field"
                                explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                items={[
                                    () => <Skeleton className="h-[14px] w-40 rounded" />,
                                    () => (
                                        <SurfaceListCard>
                                            {Array.from({ length: 3 }).map((_unused, index) => (
                                                <SurfaceListCardItem key={index}>
                                                    <StackH
                                                        gap={4}
                                                        principle="content-row"
                                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                        justify="between"
                                                        align="center"
                                                        items={[
                                                            () => (
                                                                <StackH
                                                                    gap={3}
                                                                    principle="identity"
                                                                    explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                                                    align="center"
                                                                    classNames={["min-w-0", "flex-1"]}
                                                                    items={[
                                                                        () => <Skeleton className="size-4 shrink-0 rounded" />,
                                                                        () => (
                                                                            <Skeleton.Typography
                                                                                type="body-sm"
                                                                                width="1/2"
                                                                                className="min-w-0 flex-1"
                                                                            />
                                                                        ),
                                                                    ]}
                                                                />
                                                            ),
                                                            () => <Skeleton className="h-5 w-16 shrink-0 rounded-full" />,
                                                        ]}
                                                    />
                                                </SurfaceListCardItem>
                                            ))}
                                        </SurfaceListCard>
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
