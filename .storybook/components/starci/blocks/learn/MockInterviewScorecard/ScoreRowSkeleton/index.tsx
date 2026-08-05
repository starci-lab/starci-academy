import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/** Same shape as {@link ScoreRow}, shimmering — `ProgressMeter` has no `isSkeleton` of its own (see file header). */
export const ScoreRowSkeleton = () => (
    <StackH
        gap={4}
        align="center"
        principles={["content-row"]}
        items={[
            () => <Typography size="sm" isSkeleton />,
            () => <HeroSkeleton className="h-1 flex-1 rounded-full" />,
            () => <Typography size="xs" isSkeleton />,
        ]}
    />
)
