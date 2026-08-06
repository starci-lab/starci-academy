import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { Container } from "@/components/frames/Container"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** How many word-bank chip tiles the skeleton draws below the question card. */
const WORD_BANK_TILES = 6
/** How many cloze-blank chips are woven into the mock question paragraph. */
const CLOZE_BLANKS = 3

/**
 * Loading placeholder for the "Quick quiz" active run. Mirrors the real shape
 * top-to-bottom: the edge-to-edge {@link import("@/components/blocks/navigation/WorkSessionHeader").WorkSessionHeader}
 * band (back-link · identity · counter · progress-segment bar), then a
 * `max-w-3xl` centered body — level/tag chips, the cloze question card (label +
 * two lines of question text + an instruction line + a mock paragraph with
 * rounded-lg blank tiles woven between text bars — same shape as the real
 * fill-in-the-blank chips), the "Word bank" word-bank chip row, and the
 * "Check" CTA — so the run resolves in place without a layout jump.
 */
export const QuizSessionSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
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
                                    items={Array.from({ length: 6 }, (_, index) => () => (
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
                                            <SurfaceCard
                                                padding={6}
                                                body={() => (
                                                    <StackV
                                                        gap={4}
                                                        principle="label-field"
                                                        items={[
                                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                            () => <Skeleton.Typography type="body" width="3/4" />,
                                                            () => <Skeleton.Typography type="body" width="2/3" />,
                                                            () => (
                                                                <div className="border-t border-divider pt-3">
                                                                    <Skeleton.Typography type="body-xs" width="1/2" />
                                                                </div>
                                                            ),
                                                            () => (
                                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                                                                    <Skeleton className="h-4 w-20 rounded" />
                                                                    {Array.from({ length: CLOZE_BLANKS }, (_, index) => (
                                                                        <React.Fragment key={index}>
                                                                            <Skeleton className="h-6 min-w-16 rounded-lg" />
                                                                            <Skeleton className="h-4 w-24 rounded" />
                                                                        </React.Fragment>
                                                                    ))}
                                                                </div>
                                                            ),
                                                        ]}
                                                    />
                                                )}
                                            />
                                        ),
                                        () => (
                                            <StackV
                                                gap={6}
                                                items={[
                                                    () => (
                                                        <StackV
                                                            gap={4}
                                                            principle="label-field"
                                                            items={[
                                                                () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                                () => (
                                                                    <Cluster
                                                                        gap={3}
                                                                        principle="chip-row"
                                                                        align="center"
                                                                        items={Array.from({ length: WORD_BANK_TILES }, (_, index) => () => (
                                                                            <Skeleton.Button key={index} width="w-20" />
                                                                        ))}
                                                                    />
                                                                ),
                                                            ]}
                                                        />
                                                    ),
                                                    () => <Skeleton.Button width="w-24" className="self-start" />,
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
