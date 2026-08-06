import React from "react"
import { cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Button } from "@/components/atoms/buttons/Button"
import { CardBody } from "../CardBody"
import { CTA_LABEL, type ContinueCardHeroProps } from "../types"

/**
 * `.Hero` — ONE "continue the session in progress" highlight on a surface.
 *
 * Light streak + watermark glyph + CTA as a BUTTON. Use for exactly one card on
 * a surface; two side by side and both lose their emphasis.
 */
export const ContinueCardHero = (props: ContinueCardHeroProps) => {
    const { onPress, className, isSkeleton = false } = props
    return (
        <SurfaceCard identity={{ tier: "block", component: "ContinueCardHero" }}
            isHighlight
            isSkeleton={isSkeleton}

            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        <Button
                            isSkeleton={isSkeleton}
                            variant="primary"
                            size="sm"
                            label={CTA_LABEL}
                            suffixIcon={ArrowRightIcon}
                            iconSlide
                            onPress={onPress}

                            classNames={["w-fit", "shrink-0"]}
                        />
                    }
                />
            )}
        />
    )
}
