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
    return (
        <>
            {/* The outer row = ONE horizontal track ⇒ `StackH` (children are ARBITRARY, not a
                repeating list so NOT `Cluster`). The inner column = a vertical track ⇒ `StackV`.
                Placement within the parent row uses `flex-fill-base` (min-w-0 flex-1) rather than
                a public classNames door. */}
            <StackH
                gap={4}
                principle="content-row"
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                align="center"
                isSkeleton={isSkeleton}
                items={[
                    ({ isSkeleton }: SkeletonProps) => (
                        <StackV
                            principle="flex-fill-base"
                            explain="Fills the remaining row width — not flex-fill, because this is the base-width fill rather than a breakpoint-owned grow."
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackV
                                        gap={3}
                                        principle="sibling-stack"
                                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <Typography weight="medium" truncate isSkeleton={isSkeleton} text={title} />
                                            ),
                                            ...(isSkeleton ? [() => (
                                                // `ListMeta` (the scaffold the live branch uses here) has no `isSkeleton`
                                                // yet and sits outside this round's boundary — CardBody calls that scaffold
                                                // DIRECTLY so it builds ONE shimmer bar in place of the meta/subtitle row
                                                // (the real shape always has EXACTLY ONE of the two) using atom `Typography`.
                                                <Typography size="xs" color="muted" isSkeleton />
                                            )] : meta?.length || timeLeft ? [() => (
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
                                            )] : subtitle ? [() => (
                                                <Typography size="xs" color="muted" truncate text={subtitle} />
                                            )] : []),
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
            {/* Progress SITS right under the text cluster, BEFORE the button:
            where am I → how much progress → what's next. Put it
            after the CTA and it reads as detached from the card, misread as belonging to the block below. */}
            {value === undefined ? null : (
                <ProgressMeter value={value} max={max} isSkeleton={isSkeleton} />
            )}
            {cta}
        </>
    )
}
