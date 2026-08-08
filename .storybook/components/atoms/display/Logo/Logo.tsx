/** @noSkeleton renders the brand mark, which is always present and never loading. */
/**
 * ATOM — `Logo`: the system's one and only brand mark (a "C" glyph in pink stroke
 * plus two dotted corner marks), inline SVG, no background, one fixed colour.
 *
 * Its only appearance prop is `size` (`navbar` | `footer`). Placement CSS doors are
 * not public. Side-by-side tiles (heights + dark background) are `states[]` of
 * `Default`, not separate leaves.
 */
import React from "react"
import { cn } from "@heroui/react"
/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/Logo`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/**
 * The two real hosts this mark sits in: the navbar (short bar, `h-8 w-auto`)
 * and the footer (taller block, `h-10 w-auto`). Not a general size scale —
 * a caller in a third context still has none of these fit and should get a
 * new named value added here, not a raw height passed through `className`.
 */
export type LogoSize = "navbar" | "footer"

/** `size` → the exact height utility each host already relies on. */
const sizeClassName: Record<LogoSize, string> = {
    navbar: "h-8 w-auto",
    footer: "h-10 w-auto",
}

/** Props for the {@link Logo} block. */
export interface LogoProps {
    /**
     * Which host bar this mark sits in — drives the root height (width follows,
     * `w-auto`). Defaults to `"navbar"` (`h-8 w-auto`), matching the prior
     * hard-coded size. Height is a `size` prop rather than a `classNames`
     * utility — `h-8`/`h-10` are not placement utilities.
     */
    size?: LogoSize
}

/**
 * Logo — the StarCi brand mark: a brand-pink circuit-traced "C" + corner circuit
 * nodes, on a transparent background (no dark square), so the pink mark sits on
 * the nav/footer/splash surface directly. Inlined as SVG (crisp at any size, no
 * HTTP round-trip).
 *
 * Square (1:1), single fixed colour (brand pink — reads on light OR dark surface).
 * Sizing is host-controlled via {@link LogoProps.size} (`"navbar"` → `h-8`,
 * `"footer"` → `h-10`); width follows (`w-auto`). Under a `flex-col` /
 * `items-stretch` ancestor the browser still stretches width regardless of
 * ratio — such callers add `self-start` themselves.
 *
 * @param props.size - which host bar this sits in; picks the root height.
 */
const LogoBase = ({ size = "navbar" }: LogoProps) => {
    return (
        <svg
            data-tier="atom"
            data-component="Logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="512"
            height="512"
            className={cn(sizeClassName[size], "shrink-0")}
            role="img"
            aria-label="StarCi Academy"
        >
            {/* no background — just the brand-pink circuit "C" on transparent */}
            <path
                d="M 339 208 A 96 96 0 1 0 339 304"
                fill="none"
                stroke="#FB59A7"
                strokeWidth="50"
                strokeLinecap="round"
            />
            <circle cx="339" cy="208" r="19" fill="#FB59A7" />
            <circle cx="339" cy="304" r="12" fill="none" stroke="#FB59A7" strokeWidth="12" />
            {/* corner circuit stubs + nodes */}
            <path d="M 108 108 L 148 108 M 108 108 L 108 148" fill="none" stroke="#FB59A7" strokeWidth="24" strokeLinecap="round" />
            <path d="M 404 404 L 364 404 M 404 404 L 404 364" fill="none" stroke="#FB59A7" strokeWidth="24" strokeLinecap="round" />
            <circle cx="404" cy="108" r="14" fill="#FB59A7" />
            <circle cx="108" cy="404" r="14" fill="#FB59A7" />
        </svg>
    )
}

/** `Logo.*` — StarCi brand-mark namespace. */
export { LogoBase as Logo }

/** Tier metadata for `Logo`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "Logo" } as const
