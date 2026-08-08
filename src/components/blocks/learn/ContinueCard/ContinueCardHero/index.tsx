import React from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Button } from "@/components/atoms/buttons/Button"
import type { CallerIdentity } from "@/components/frames/_identity"
import { CardBody } from "../CardBody"
import { CTA_LABEL, type ContinueCardHeroProps } from "../types"

/**
 * `.Hero` — ONE "continue the session in progress" highlight on a surface.
 *
 * Light streak + watermark glyph + CTA as a BUTTON. Use for exactly one card on
 * a surface; two side by side and both lose their emphasis.
 */
export const ContinueCardHero = ({
    identity = { tier: "block", component: "ContinueCardHero" },
    onPress,
    isSkeleton = false,
    ...props
}: ContinueCardHeroProps & { identity?: CallerIdentity }) => {
    return (
        <SurfaceCard
            identity={identity}
            isHighlight
            isSkeleton={isSkeleton}
            // CardBody peers (title / progress / CTA) need a stack until CardBody owns one.
            bodyVariant="tile"
            body={() => (
                <CardBody
                    {...props}
                    onPress={onPress}
                    isSkeleton={isSkeleton}
                    cta={
                        <Button
                            isSkeleton={isSkeleton}
                            variant="primary"
                            size="sm"
                            label={CTA_LABEL}
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onPress}
                        />
                    }
                />
            )}
        />
    )
}