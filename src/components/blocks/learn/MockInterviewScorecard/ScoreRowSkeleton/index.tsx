import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/** Same shape as {@link ScoreRow}, shimmering — `ProgressMeter` has no `isSkeleton` of its own (see file header). */
export const ScoreRowSkeleton = () => (
    <StackH
        gap={4}
        align="center"
        principle="content-row"
        items={[
            () => <Typography size="sm" isSkeleton classNames={["shrink-0", "w-1/4"]} />,
            () => <HeroSkeleton className="h-1 flex-1 rounded-full" />,
            () => <Typography size="xs" isSkeleton classNames={["shrink-0", "w-1/4"]} />,
        ]}
    />
)
