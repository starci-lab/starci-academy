import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { Container } from "@/components/frames/Container"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for the flashcard reviewer. Mirrors the real shape
 * top-to-bottom: the edge-to-edge {@link import("@/components/blocks/navigation/WorkSessionHeader").WorkSessionHeader}
 * band (back-link · deck identity · counter · progress-segment bar), then a
 * `max-w-3xl` centered body — level/tag chips, the {@link import("@/components/blocks/cards/FlipCard").FlipCard}
 * face (label + two prompt lines), and the prev/show-answer controls. (Was wrong:
 * a thin progress bar instead of the header band, so the band popped in on resolve.)
 */
export const FlashcardReviewerSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <StackV
                gap={6}
                items={[
                    () => (
                        <div className="border-b border-default bg-surface">
                            <StackH
                                gap={1}
                                padding={{ base: { x: 5, y: 3 }, sm: { x: 6, y: 3 } }}
                                principle="pill-pad"
                                items={[
                                    () => (
                                        <StackH
                                            gap={4}
                                            principle="content-row"
                                            align="center"
                                            items={[
                                                () => <Skeleton className="h-4 w-16 rounded" />,
                                                () => (
                                                    <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />
                                                ),
                                                () => <Skeleton className="hidden h-4 w-24 rounded @app-sm:block" />,
                                                () => (
                                                    <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />
                                                ),
                                                () => <Skeleton className="h-4 w-20 rounded" />,
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                            <Box principle="pill-pad" className="px-4 pb-2 @app-sm:px-6">
                                <StackH
                                    gap={2}
                                    classNames={["w-full"]}
                                    items={Array.from({ length: 6 }, (_unused, index) => () => (
                                        <Skeleton key={index} className="h-1 flex-1 rounded-full" />
                                    ))}
                                />
                            </Box>
                        </div>
                    ),
                    () => (
                        <Container
                            size="md"
                            padding={1}
                            body={() => (
                                <StackV
                                    gap={6}
                                    items={[
                                        () => (
                                            <Cluster
                                                gap={3}
                                                principle="chip-row"
                                                align="center"
                                                items={[
                                                    () => <Skeleton.Chip />,
                                                    () => <Skeleton.Chip />,
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <StackV
                                                gap={4}
                                                principle="label-field"
                                                items={[
                                                    () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                    () => (
                                                        <SurfaceCard
                                                            padding={6}
                                                            body={() => (
                                                                <StackV
                                                                    gap={4}
                                                                    principle="sibling-stack"
                                                                    items={[
                                                                        () => <Skeleton.Typography type="body" width="3/4" />,
                                                                        () => <Skeleton.Typography type="body" width="2/3" />,
                                                                    ]}
                                                                />
                                                            )}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <StackH
                                                gap={4}
                                                principle="flex-action"
                                                justify="between"
                                                align="center"
                                                items={[
                                                    () => <Skeleton.Button />,
                                                    () => <Skeleton.Button />,
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            )}
                        />
                    ),
                ]}
            />
        </div>
    )
}
