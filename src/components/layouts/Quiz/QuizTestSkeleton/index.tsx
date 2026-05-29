"use client"

import React from "react"
import {
    Card,
    CardContent,
    Skeleton,
} from "@heroui/react"
import {
    SkeletonText,
} from "@/components/reuseable"

/** Props for {@link QuizTestSkeleton}. */
export interface QuizTestSkeletonProps {
    /** Number of placeholder question cards to render. Defaults to `3`. */
    count?: number
    /** Number of placeholder option rows per question. Defaults to `4`. */
    options?: number
}

/**
 * Loading placeholder for the quiz test. Mirrors the real layout: a list of
 * question cards (prompt + choice rows) followed by the submit button.
 * @param props - {@link QuizTestSkeletonProps}
 */
export const QuizTestSkeleton = ({
    count = 3,
    options = 4,
}: QuizTestSkeletonProps) => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: Math.max(count, 1) }).map((_unused, cardIndex) => (
                <Card key={cardIndex}>
                    <CardContent className="flex flex-col gap-3">
                        {/* question prompt */}
                        <SkeletonText size="base" width="w-3/4" />
                        {/* choice rows */}
                        <div className="flex flex-col gap-2">
                            {Array.from({ length: Math.max(options, 1) }).map((_opt, optionIndex) => (
                                <Skeleton key={optionIndex} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {/* submit button */}
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
    )
}
