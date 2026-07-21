import React from "react"
import { cn } from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { BrandLogo } from "@/components/blocks/identity/BrandLogo"

/** Props for the {@link BrandLockup} block. */
export type BrandLockupProps = WithClassNames<undefined>

/**
 * BrandLockup — the {@link BrandLogo} icon flush against the "StarCi Academy"
 * wordmark (StarCi on top, ACADEMY small-caps muted below). Shared by the
 * navbar and footer so both read the identical mark from one source.
 *
 * The wordmark hides below `md` (icon-only on mobile, where header/footer
 * width is tight) and reappears at `md` and up.
 *
 * Presentational only — wrap it in a link/button where it needs to act.
 *
 * @param props - optional className (placement only, applied to the outer
 * flex row — e.g. `self-start` under a stretching flex-col parent).
 */
export const BrandLockup = ({ className }: BrandLockupProps) => {
    return (
        <span className={cn("inline-flex items-center gap-0", className)}>
            <BrandLogo className="h-10" />
            <span className="hidden flex-col gap-0 @app-md:flex">
                <div className="text-sm font-semibold leading-none text-foreground">
                    StarCi
                </div>
                <div className="text-[8px] uppercase leading-none text-muted">
                    Academy
                </div>
            </span>
        </span>
    )
}
