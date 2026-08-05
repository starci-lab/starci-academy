import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { ListMeta } from "@sb-components/composites/lists/List/List"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { type ContinueCardDataProps } from "./types"

/** Shared internals: eyebrow-less, title → meta/subtitle → progress → CTA. */
export const CardBody = ({
    title,
    subtitle,
    value,
    max = 100,
    meta,
    timeLeft,
    urgent = false,
    isSkeleton = false,
    cta,
}: ContinueCardDataProps & { cta: React.ReactNode }) => {
    const titleAndMeta = (
        <>
            <Typography weight="medium" truncate isSkeleton={isSkeleton} text={title} />
            {isSkeleton ? (
                // `ListMeta` (the scaffold the live branch uses here) has no `isSkeleton`
                // yet and sits outside this round's boundary — CardBody calls that scaffold
                // DIRECTLY so it builds ONE shimmer bar in place of the meta/subtitle row
                // (the real shape always has EXACTLY ONE of the two) using atom `Typography`.
                <Typography size="xs" color="muted" isSkeleton />
            ) : meta?.length || timeLeft ? (
                <ListMeta
                    items={meta ?? []}

                    chip={
                        timeLeft ? (
                            // Same kind of information (time left) ⇒ the same element in
                            // EVERY case; only the TONE escalates: `default` while time
                            // remains, `warning` when it's about to run out.
                            () => (
                                <Chip
                                    tone={urgent ? "warning" : "default"}

                                    text={timeLeft}
                                />
                            )
                        ) : undefined
                    }
                />
            ) : subtitle ? (
                <Typography size="xs" color="muted" truncate text={subtitle} />
            ) : null}
        </>
    )

    return (
        <>
            {/* The outer row = ONE horizontal track ⇒ `StackH` (children are ARBITRARY, not a
                repeating list so NOT `Cluster`). The inner column = a vertical track ⇒ `StackV`.
                `min-w-0 flex-1` stays in `className`: that's its PLACEMENT within the parent row
                (`className` is allowed for placement), not the scaffold's own shape. */}
            <div className="relative">
                <StackH
                    gap={4}
                    principles={["content-row"]}
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        ({ isSkeleton }: SkeletonProps) => <StackV gap={3} classNames={["min-w-0", "flex-1"]} isSkeleton={isSkeleton} items={[() => titleAndMeta]} />,
                    ]}
                />
            </div>
            {/* Progress SITS right under the text cluster, BEFORE the button:
            where am I → how much progress → what's next. Put it
            after the CTA and it reads as detached from the card, misread as belonging to the block below. */}
            {value === undefined ? null : isSkeleton ? (
                // `ProgressMeter` (scaffold) has no `isSkeleton` yet and sits outside this
                // round's boundary — CardBody calls that scaffold directly so it builds a
                // track shimmer bar matching the real track height (`h-1`, see `ProgressMeter.tsx`).
                <HeroSkeleton className="h-1 w-full rounded-full" />
            ) : (
                <ProgressMeter value={value} max={max} />
            )}
            <div className="relative">{cta}</div>
        </>
    )
}
