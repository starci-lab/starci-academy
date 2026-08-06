import React from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Segment count mirrors the setup default question draw (see `QNA_QUESTION_COUNT`
 *  in `MockInterviewSession`) — an approximate legend length is fine since the
 *  real bar redraws immediately once the session's actual total is known. */
const PROGRESS_SEGMENTS = 5

/**
 * Loading placeholder for the LIVE interview surface — shown while
 * `courseId`/`courseDisplayId`/the enrollment check are still resolving on
 * the dedicated `/interview/[sessionId]` resume route (before
 * {@link import("../MockInterviewSession").MockInterviewSession} itself has
 * mounted, so its own resume-rehydrate effect hasn't started yet). Mirrors
 * `WorkSessionHeader` (back-link · identity · counter · timer · progress
 * segments) + the interviewer presence card (avatar + name/role + a 4-line
 * question) + the voice hero's push-to-talk mic + the answer action row.
 */
export const MockInterviewSessionSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={cn("flex h-[calc(100dvh-4rem)] w-full flex-col", className)}>
            {/* sub-navbar band — mirrors WorkSessionHeader */}
            <div className="sticky top-16 z-10 border-b border-default bg-surface">
                <Box principle="control-pad" className="px-4 py-2 @app-sm:px-6"
                    explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row.">
                    <StackH
                        gap={4}
                        principle="content-row"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        items={[
                            () => <Skeleton className="h-4 w-14 rounded" />,
                            () => <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />,
                            () => (
                                <StackH
                                    gap={3}
                                    principle="identity"
                                    explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                    classNames={["min-w-0"]}
                                    items={[
                                        () => <Skeleton className="size-7 shrink-0 rounded-full" />,
                                        () => <Skeleton className="hidden h-4 w-20 rounded @app-sm:block" />,
                                    ]}
                                />
                            ),
                            () => <span className="hidden h-5 w-px shrink-0 bg-default @app-sm:block" aria-hidden />,
                            () => <Skeleton className="h-4 w-20 rounded" />,
                            () => <span className="flex-1" />,
                            () => <Skeleton className="h-4 w-14 rounded" />,
                        ]}
                    />
                </Box>
                <div data-principle="control-pad" className="px-4 pb-2 @app-sm:px-6" role="presentation">
                    <StackH
                        gap={2}
                        classNames={["w-full"]}
                        items={Array.from({ length: PROGRESS_SEGMENTS }, (_, position) => () => (
                            <Skeleton key={position} className="h-1 flex-1 rounded-full" />
                        ))}
                    />
                </div>
            </div>

            <Box principle="page-pad" className="min-h-0 flex-1 overflow-y-auto p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <div data-principle="block-boundary" className="grid min-h-0 h-full gap-6 @app-lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <StackV
                        gap={6}
                        principle="block-boundary"
                        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                        classNames={["min-w-0"]}
                        items={[
                            () => (
                                <SurfaceCard
                                    padding={5}
                                    body={() => (
                                        <StackV
                                            gap={4}
                                            items={[
                                                () => (
                                                    <StackH
                                                        gap={3}
                                                        principle="identity"
                                                        explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                                        items={[
                                                            () => <Skeleton.Avatar />,
                                                            () => (
                                                                <StackV
                                                                    gap={2}
                                                                    principle="title-subtitle"
                                                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                                    classNames={["min-w-0"]}
                                                                    items={[
                                                                        () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                                                        () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                                    ]}
                                                                />
                                                            ),
                                                        ]}
                                                    />
                                                ),
                                                () => (
                                                    <div className="border-t border-default pt-3">
                                                        <StackV
                                                            gap={3}
                                                            principle="sibling-stack"
                                                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                                            items={[
                                                                () => <Skeleton.Typography type="body-sm" width="full" />,
                                                                () => <Skeleton.Typography type="body-sm" width="full" />,
                                                                () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                                                () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                                            ]}
                                                        />
                                                    </div>
                                                ),
                                            ]}
                                        />
                                    )}
                                />
                            ),
                            () => (
                                <div className="flex flex-col items-center">
                                    <StackV
                                        gap={4}
                                        principle="card-caption"
                                        explain="Holds caption text under card media so the caption stays attached to the image above it."
                                        items={[
                                            () => <Skeleton className="size-20 shrink-0 rounded-full" />,
                                            () => <Skeleton.Typography type="body-sm" width="1/4" />,
                                        ]}
                                    />
                                </div>
                            ),
                            () => (
                                <div className="flex flex-col items-center">
                                    <StackV
                                        gap={4}
                                        items={[
                                            () => <Skeleton.Button width="w-48" />,
                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                        ]}
                                    />
                                </div>
                            ),
                        ]}
                    />

                    {/* RIGHT — workspace pane */}
                    <div className="min-w-0">
                        <Skeleton className="h-full min-h-64 w-full rounded-2xl" />
                    </div>
                </div>
            </Box>
        </div>
    )
}
