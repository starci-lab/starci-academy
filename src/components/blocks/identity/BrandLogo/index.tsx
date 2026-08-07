import React from "react"
import { Logo } from "@/components/blocks/identity/Logo"

/** Closed size tokens for {@link BrandLogo}. */
export type BrandLogoSize = "sm" | "md" | "lg"

const SIZE_CLASS: Record<BrandLogoSize, string> = {
    sm: "h-9 w-auto",
    md: "h-10 w-auto",
    lg: "h-14 w-auto",
}

/** Props for the {@link BrandLogo} block. */
export type BrandLogoProps = {
    /** Height preset — sm (36px), md (40px), lg (56px). */
    size?: BrandLogoSize
}

/**
 * BrandLogo — the StarCi brand mark: the favicon "S" mark ({@link Logo}), the
 * circuit-traced "S" on a dark rounded square (no wordmark, no flame). Thin
 * placement wrapper around {@link Logo}.
 *
 * Kept as the shared identity entry point so callers (navbar, footer, splash)
 * don't need to change. Presentational only — wrap it in a link/button where it
 * needs to act. Square (1:1): default `sm` → a 36px icon.
 */
export const BrandLogo = ({ size = "sm" }: BrandLogoProps) => {
    return <Logo className={SIZE_CLASS[size]} />
}
