"use client"

import React from "react"
import {
    Card,
    CardContent,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Props for {@link ContinueLearningSkeleton}. */
export type ContinueLearningSkeletonProps = WithClassNames<undefined>

/**
 * Loading skeleton for {@link import("..").ContinueLearning}. Mirrors the loaded
 * resume-cards grid — three placeholder cards in the same
 * `@app-sm:grid-cols-2 @app-lg:grid-cols-3` layout, each echoing a {@link import("../ResumeCard").ResumeCard}'s
 * `ContinueCard variant="item"` anatomy: NO leading icon, a title + subtitle
 * column, then the "Tiếp tục →" CTA (`SeeMoreLink`) on its OWN row below — no
 * progress-meter line (`hideProgress`). So it reserves the real height and never
 * jumps when the leaf queries resolve. (Was wrong: drew a round avatar the item
 * card never has + an inline-right CTA instead of the own-row link.)
 * @param props - optional className for the root element (placement only).
 */
export const ContinueLearningSkeleton = ({
    className,
}: ContinueLearningSkeletonProps) => (
    <div className={cn("grid gap-3 @app-sm:grid-cols-2 @app-lg:grid-cols-3", className)}>
        {[0, 1, 2].map((card) => (
            <Card key={card} className="h-full">
                <CardContent className="flex h-full flex-col gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <Skeleton.Typography type="body-sm" width="3/4" />
                        <Skeleton.Typography type="body-xs" width="1/2" />
                    </div>
                    {/* CTA "Tiếp tục →" — own row below the title (SeeMoreLink), not inline-right */}
                    <Skeleton.Typography type="body-sm" width="1/3" />
                </CardContent>
            </Card>
        ))}
    </div>
)

export default ContinueLearningSkeleton
