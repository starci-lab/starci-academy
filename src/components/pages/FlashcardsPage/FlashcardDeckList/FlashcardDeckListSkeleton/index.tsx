import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link FlashcardDeckListSkeleton}. */
export interface FlashcardDeckListSkeletonProps extends WithClassNames<undefined> {
    /** Number of placeholder deck cards to render. Defaults to `3`. */
    count?: number
}

/**
 * Loading placeholder for {@link FlashcardDeckList}. Mirrors the real deck cards:
 * a title row with a difficulty chip, a short description preview, and a footer
 * row with the card count and the study button.
 * @param props - {@link FlashcardDeckListSkeletonProps}
 */
export const FlashcardDeckListSkeleton = ({
    count = 3,
    className,
}: FlashcardDeckListSkeletonProps) => {
    return (
        <div className={className}>
            <StackV
                gap={4}
                items={Array.from({ length: Math.max(count, 1) }, () => () => (
                    <SurfaceCard
                        padding={5}
                        body={() => (
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                items={[
                                    () => (
                                        <StackH
                                            gap={4}
                                            principle="content-row"
                                            justify="between"
                                            align="center"
                                            items={[
                                                () => <Skeleton.Typography type="body" width="1/2" />,
                                                () => <Skeleton.Chip />,
                                            ]}
                                        />
                                    ),
                                    () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                    () => (
                                        <StackH
                                            gap={4}
                                            principle="content-row"
                                            justify="between"
                                            align="center"
                                            items={[
                                                () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                () => <Skeleton.Button />,
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        )}
                    />
                ))}
            />
        </div>
    )
}
