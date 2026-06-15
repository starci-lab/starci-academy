"use client"

import React from "react"
import {
    Card,
    Skeleton,
} from "@heroui/react"
import {
    SkeletonParagraph,
    SkeletonText,
} from "@/components/reuseable"
import type {
    WithClassNames,
} from "@/modules/types"
import {
    cn,
} from "@heroui/react"

export type FreeTierCardSkeletonProps = WithClassNames<undefined>

/**
 * Loading placeholder for {@link FreeTierCard}.
 *
 * Presentational: mirrors Card layout (title row, 2lh description, price, USD
 * spacer, CTA, footer credit rows).
 * @param props.className - Optional wrapper class.
 */
export const FreeTierCardSkeleton = ({
    className,
}: FreeTierCardSkeletonProps) => {
    return (
        <Card className={cn("flex h-full flex-col", className)}>
            <Card.Content className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-1.5">
                    <Skeleton className="size-6 shrink-0 rounded-full" />
                    <SkeletonText
                        size="lg"
                        width="w-24"
                    />
                </div>
                <div className="h-[2lh] text-sm leading-normal">
                    <SkeletonParagraph
                        size="sm"
                        lines={2}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <SkeletonText
                        size="3xl"
                        width="w-20"
                    />
                    <div
                        className="h-[3lh] text-sm leading-normal"
                        aria-hidden
                    >
                        <SkeletonParagraph
                            size="sm"
                            lines={3}
                        />
                    </div>
                </div>
                <Skeleton className="h-9 w-full rounded-full" />
            </Card.Content>
            <Card.Footer>
                {/* invisible spacer — mirrors FreeTierCard's empty footer so the
                    card height matches the paid tiers' credit list */}
                <div
                    className="flex flex-col gap-1.5 text-sm invisible"
                    aria-hidden
                >
                    <div className="flex min-h-5 items-center gap-1.5">—</div>
                    <div className="flex min-h-5 items-center gap-1.5">—</div>
                </div>
            </Card.Footer>
        </Card>
    )
}
