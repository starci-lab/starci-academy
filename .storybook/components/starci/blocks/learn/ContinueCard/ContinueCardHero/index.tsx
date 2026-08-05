import React from "react"
import { cn } from "@heroui/react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
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
        <SurfaceCard
            isHighlight
            isSkeleton={isSkeleton}

            contentClassName={cn("relative flex flex-col gap-3 overflow-hidden", className)}
            body={() => (
                <CardBody
                    {...props}
                    cta={
                        // Atom `Button` already has `isSkeleton` (§12c) — the flag flows
                        // straight down, no need to build a separate bar here. The label is a
                        // design CONSTANT (§14d.1). The atom accepts `label` + `suffixIcon` as a
                        // COMPONENT REF (§12b) and forces its own glyph scale + weight (§4/§5.0a).
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
