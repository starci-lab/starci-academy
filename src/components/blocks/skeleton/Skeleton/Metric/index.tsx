import React from "react"
import { Card, CardContent, Skeleton } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link SkeletonMetric} (no part-specific props). */
export type SkeletonMetricProps = WithClassNames<undefined>

/**
 * Skeleton matching a {@link import("@/components/blocks").MetricCard} — which is a
 * FRAMED card (SectionCard) around value + label + hint. So this renders its own
 * `Card` + `CardContent` frame with a value bar (h4), a label bar (body-sm) and a
 * hint bar (body-xs), so `<Skeleton.Metric/>` shares MetricCard's exact box.
 */
export const SkeletonMetric = ({ className }: SkeletonMetricProps) => (
    <Card className={className}>
        <CardContent>
            <div className="flex flex-col gap-2">
                {/* Value (h4) */}
                <Skeleton className="h-6 w-16 rounded" />
                {/* Label (body-sm) */}
                <Skeleton className="my-[5px] h-[14px] w-2/3 rounded" />
                {/* Hint (body-xs) */}
                <Skeleton className="h-3 w-24 rounded" />
            </div>
        </CardContent>
    </Card>
)
