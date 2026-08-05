import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { LinkSeeMore } from "@/components/atoms/navigation/Link"
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
    const { href, onPress, className, isSkeleton = false } = props
    return (
        <SurfaceCard
            isSkeleton={isSkeleton}

            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        isSkeleton ? (
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
