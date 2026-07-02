import React from "react"
import { cn } from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { Logo } from "@/components/blocks/identity/Logo"

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
