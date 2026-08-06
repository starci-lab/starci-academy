import React from "react"
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
    const { href, onPress, isSkeleton = false } = props
    return (
        <SurfaceCard identity={{ tier: "block", component: "ContinueCardItem" }}
            isSkeleton={isSkeleton}
            // CardBody peers (title / progress / CTA) need a stack until CardBody owns one.
            contentClassName="relative flex flex-col gap-3 overflow-hidden"
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        <LinkSeeMore
                            href={href}
                            onPress={onPress}
                            label={CTA_LABEL}
                            isSkeleton={isSkeleton}
                        />
                    }
                />
            )}
        />
    )
}
