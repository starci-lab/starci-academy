import React from "react"
import {
    Card,
    cn,
} from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK (loading composite) ported faithfully from
 * `@/components/blocks/cards/CourseCardSkeleton`. Composed from the local
 * `Skeleton` primitive inside a HeroUI `Card` frame — it MIRRORS the grid
 * `CourseCard` layout (cover, title, 2 description lines, a 3-row value-prop
 * list, price, and a TWO-button action row) so the courses grid does not jump
 * when data resolves. Synced to `src` later.
 */
export const CourseCardSkeleton = ({ className }: { className?: string }) => {
    return (
        <Card className={cn("flex flex-col overflow-hidden rounded-3xl", className)}>
            <Card.Content className="flex flex-col gap-3 p-0">
                {/* cover 16:9 */}
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <div className="flex flex-col gap-2">
                    {/* title */}
                    <Skeleton.Typography type="h6" width="2/3" />
                    {/* description (line-clamp-2) */}
                    <Skeleton.Typography type="body-sm" width="full" />
                    <Skeleton.Typography type="body-sm" width="3/4" />
                    {/* value-props list (up to 3 check-icon rows) */}
                    <ul className="mt-1 flex flex-col gap-2">
                        {[0, 1, 2].map((index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Skeleton className="size-4 shrink-0 rounded-full" />
                                <Skeleton.Typography type="body-xs" width="2/3" />
                            </li>
                        ))}
                    </ul>
                </div>
            </Card.Content>
            <Card.Footer className="mt-auto flex flex-col gap-2 pt-3">
                {/* price row */}
                <Skeleton.Typography type="body" width="1/3" />
                {/* action row — primary + secondary button */}
                <div className="flex w-full items-center gap-2">
                    <Skeleton.Button width="flex-1" />
                    <Skeleton.Button width="flex-1" />
                </div>
            </Card.Footer>
        </Card>
    )
}
