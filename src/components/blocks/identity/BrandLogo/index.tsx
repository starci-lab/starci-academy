import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import { SparkleIcon } from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for the {@link BrandLogo} block. */
export type BrandLogoProps = WithClassNames<undefined>

/**
 * The StarCi brand lockup: a Phosphor sparkle mark (accent) followed by the
 * wordmark — "StarCi" with a smaller, uppercase, wide-tracked "ACADEMY" stacked
 * beneath. Presentational only (owns the whole look, incl. the 10px tagline that
 * has no Typography type); wrap it in a link/button where it needs to act.
 *
 * @param props - optional className (placement only).
 */
export const BrandLogo = ({ className }: BrandLogoProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* brand mark = Phosphor sparkle (accent, fill) size-5 — thay ngọn lửa PNG */}
            <SparkleIcon aria-hidden focusable="false" weight="fill" className="size-5 text-accent" />
            <div className="flex flex-col">
                <Typography type="body" weight="bold" className="leading-tight">
                    StarCi
                </Typography>
                <Typography
                    type="body-xs"
                    color="muted"
                    className="text-[10px] uppercase leading-tight tracking-widest"
                >
                    academy
                </Typography>
            </div>
        </div>
    )
}
