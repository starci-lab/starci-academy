import React from "react"
import { BrandLogo } from "@/components/blocks/identity/BrandLogo"

/**
 * BrandLockup — the {@link BrandLogo} icon flush against the "StarCi Academy"
 * wordmark (StarCi on top, ACADEMY small-caps muted below). Shared by the
 * navbar and footer so both read the identical mark from one source.
 *
 * The wordmark hides below `md` (icon-only on mobile, where header/footer
 * width is tight) and reappears at `md` and up.
 *
 * Presentational only — wrap it in a link/button where it needs to act.
 */
export const BrandLockup = () => {
    return (
        <span className="inline-flex items-center gap-0">
            <BrandLogo size="md" />
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
