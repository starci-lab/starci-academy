import React from "react"
import { Card, CardContent } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Container } from "@/components/frames/Container"
import { Grid } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Loading placeholder for {@link import("./index").FlashcardQuizResult} — mirrors its
 * REAL layout tree: HERO = 3 `MetricCard` tiles (`Skeleton.Metric`), then the
 * per-card breakdown (`LabeledCard` label → `SurfaceListCard` of status-dot · title ·
 * score-chip rows), then the weak-tags recap card (label → framed card of link rows),
 * so the surface never collapses or jumps when the session query resolves. Used on
 * the revisit-by-URL path (skeleton → result).
 */
export const FlashcardQuizResultSkeleton = () => {
    return (
        <Container
            size="md"
            padding={1}
            body={() => (
                <StackV
                    gap={6}
                    items={[
                        () => (
                            // teacher-hold: flashcards-remain-quiz-result-metric-grid-gap4-no-token —
                            // peer metric tiles at preserved step 4; no card-grid token.
                            <Grid
                                principle="content-row"
                                columns={{ base: 1, sm: 3 }}
                                items={[
                                    { key: "metric-1", content: () => <Skeleton.Metric /> },
                                    { key: "metric-2", content: () => <Skeleton.Metric /> },
                                    { key: "metric-3", content: () => <Skeleton.Metric /> },
                                ]}
                            />
                        ),
                        () => (
                            <StackV
                                as="section"
                                gap={4}
                                principle="label-field"
                                items={[
                                    () => <Skeleton className="h-[14px] w-40 rounded" />,
                                    () => (
                                        <SurfaceListCard>
                                            {Array.from({ length: 5 }).map((_unused, index) => (
                                                <SurfaceListCardItem key={index}>
                                                    <StackH
                                                        gap={4}
                                                        principle="content-row"
                                                        align="center"
                                                        items={[
                                                            () => <Skeleton className="size-2.5 shrink-0 rounded-full" />,
                                                            () => (
                                                                <Skeleton.Typography
                                                                    type="body-sm"
                                                                    width="1/2"
                                                                    className="min-w-0 flex-1"
                                                                />
                                                            ),
                                                            () => <Skeleton className="h-5 w-12 shrink-0 rounded-full" />,
                                                        ]}
                                                    />
                                                </SurfaceListCardItem>
                                            ))}
                                        </SurfaceListCard>
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <StackV
                                as="section"
                                gap={4}
                                principle="label-field"
                                items={[
                                    () => <Skeleton className="h-[14px] w-40 rounded" />,
                                    () => (
                                        <Card>
                                            <CardContent>
                                                <StackV
                                                    gap={3}
                                                    principle="sibling-stack"
                                                    items={Array.from({ length: 3 }).map((_unused, index) => () => (
                                                        <Skeleton key={index} className="h-16 w-full rounded-xl" />
                                                    ))}
                                                />
                                            </CardContent>
                                        </Card>
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
