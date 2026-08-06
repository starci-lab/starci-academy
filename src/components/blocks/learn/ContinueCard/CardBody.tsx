import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { ListMeta } from "@/components/composites/lists/List"
import { StackH, StackV } from "@/components/frames/Stack"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
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
                <Typography size="xs" color="muted" isSkeleton classNames={["w-1/2"]} />
            ) : meta?.length || timeLeft ? (
                <ListMeta
                    items={meta ?? []}

                    chip={
                        timeLeft ? (
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
            <div className="relative">
                <StackH
                    gap={4}
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    align="center"
                    isSkeleton={isSkeleton}
                    items={[
                        ({ isSkeleton }: SkeletonProps) => <StackV gap={3} classNames={["min-w-0", "flex-1"]} isSkeleton={isSkeleton} items={[() => titleAndMeta]} />,
                    ]}
                />
            </div>
            {value === undefined ? null : (
                <ProgressMeter value={value} max={max} isSkeleton={isSkeleton} />
            )}
            <div className="relative">{cta}</div>
        </>
    )
}
