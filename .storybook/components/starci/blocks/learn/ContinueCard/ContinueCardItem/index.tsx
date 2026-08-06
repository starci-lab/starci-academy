import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
import { CardBody } from "../CardBody"
import { CTA_LABEL, type ContinueCardItemProps } from "../types"

/**
 * `.Item` — ONE of N "continue" cards in a list/grid.
 *
 * Flat face, no light streak, no watermark; CTA is `LinkSeeMore` (hover + click
 * live on the link itself, not wrapping the whole card — wrapping would nest a
 * control and hijack hover).
 */
export const ContinueCardItem = (props: ContinueCardItemProps) => {
    const { href, onPress, isSkeleton = false } = props
    return (
        <SurfaceCard
            isSkeleton={isSkeleton}
            // CardBody peers (title / progress / CTA) need a stack until CardBody owns one.
            contentClassName="relative flex flex-col gap-3 overflow-hidden"
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        isSkeleton ? (
                            // Atom `LinkSeeMore` has no `isSkeleton` yet and sits outside this
                            // round's boundary — `.Item` calls that atom DIRECTLY so it builds a
                            // text shimmer bar matching the "Continue" label's size (`text-sm`, see
                            // `LinkSeeMore.tsx`) instead of branching off to build a whole fake link.
                            // The tag sits on the REAL heroui `Skeleton` element itself (not the
                            // wrapping span) — same convention as the progress-bar mirror above.
                            <span>
                                <HeroSkeleton className="h-[14px] w-20 rounded" />
                            </span>
                        ) : (
                            <LinkSeeMore
                                href={href}
                                onPress={onPress}

                                label={CTA_LABEL}
                            />
                        )
                    }
                />
            )}
        />
    )
}
