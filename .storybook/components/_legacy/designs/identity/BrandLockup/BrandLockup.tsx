import React from "react"
import { cn } from "@heroui/react"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/BrandLockup`. Authored in Storybook (not `src`);
 * synced to `src` later. Imports the local {@link Logo} port (sibling
 * folder) instead of `@/components`.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link BrandLockup} block. */
export type BrandLockupProps = WithClassNames<undefined> & {
    /**
     * Dev/spec: tag this lockup's own direct parts (`Logo` / `Wordmark`) so a
     * BlockAnatomy panel can badge them.
     */
    showAnatomy?: boolean
}

/**
 * BrandLockup — the brand mark ({@link Logo}) flush against the "StarCi Academy"
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
export const BrandLockup = ({ className, showAnatomy = false }: BrandLockupProps) => {
    return (
        <span className={cn("inline-flex items-center gap-0", className)}>
            <span data-anat-part={showAnatomy ? "Logo" : undefined}>
                <Logo.Base className="h-10 w-auto" />
            </span>
            <span className="hidden flex-col gap-0 @app-md:flex" data-anat-part={showAnatomy ? "Wordmark" : undefined}>
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
