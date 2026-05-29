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

/** Props for {@link QuizDeckListSkeleton}. */
export interface QuizDeckListSkeletonProps {
    /** Number of placeholder deck cards to render. Defaults to `3`. */
    count?: number
}

/**
 * Loading placeholder for {@link QuizDeckList}. Mirrors the real deck cards: a
 * title row with a difficulty chip, a short description preview, and a footer
 * row with the card count and the study button.
 * @param props - {@link QuizDeckListSkeletonProps}
 */
export const QuizDeckListSkeleton = ({
    count = 3,
}: QuizDeckListSkeletonProps) => {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: Math.max(count, 1) }).map((_unused, index) => (
                <Card key={index} className="w-full">
                    <CardContent className="flex flex-col gap-2">
                        {/* title + difficulty chip */}
                        <div className="flex items-center justify-between gap-3">
                            <SkeletonText size="base" width="w-1/2" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        {/* description preview */}
                        <SkeletonText size="sm" width="w-5/6" />
                        {/* card count + study button */}
                        <div className="flex items-center justify-between gap-3">
                            <SkeletonText size="xs" width="w-20" />
                            <Skeleton className="h-8 w-20 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
