import React from "react"
import { cn } from "@heroui/react"
import { Logo } from "../Logo/Logo"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/BrandLogo`. Authored in Storybook (not `src`);
 * synced to `src` later. Imports the local {@link Logo} port (sibling folder)
 * instead of `@/components`.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link BrandLogo} block. */
export type BrandLogoProps = WithClassNames<undefined>

/**
 * BrandLogo — the StarCi brand mark: the favicon "S" mark ({@link Logo}), the
 * circuit-traced "S" on a dark rounded square (no wordmark, no flame). Thin
 * placement wrapper around {@link Logo}.
 *
 * Kept as the shared identity entry point so callers (navbar, footer, splash)
 * don't need to change. Presentational only — wrap it in a link/button where it
 * needs to act. Square (1:1): `h-9 w-auto` → a 36px icon.
 *
 * @param props - optional className (placement / sizing only).
 */
export const BrandLogo = ({ className }: BrandLogoProps) => {
    return <Logo className={cn("h-9 w-auto", className)} />
}
