import React from "react"
import { Card, CardContent, Skeleton, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonCard}. */
export interface SkeletonCardProps extends WithClassNames<undefined> {
    /** Number of body block lines. Defaults to 3. */
    lines?: number
}

/**
 * Skeleton matching a HeroUI <Card/>: renders the REAL `Card` + `CardContent`
 * frame (border/radius/padding baked in) wrapping a title bar (body-sm 14px) over
 * body lines (body-xs 12px), so the loading box shares the card's exact footprint.
 */
export const SkeletonCard = ({ className, lines = 3 }: SkeletonCardProps) => (
    <Card className={className}>
        <CardContent className="flex flex-col gap-2">
            {/* Title (body-sm) */}
            <Skeleton className="my-[5px] h-[14px] w-1/2 rounded" />
            {/* Body lines (body-xs) */}
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    className={cn("h-3 rounded", index === lines - 1 ? "w-2/3" : "w-full")}
                />
            ))}
        </CardContent>
    </Card>
)
