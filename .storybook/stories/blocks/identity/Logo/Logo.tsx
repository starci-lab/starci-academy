import React from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/Logo`. Authored in Storybook (not `src`);
 * synced to `src` later. The shared `WithClassNames` base is inlined locally
 * to keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link Logo} block. */
export type LogoProps = WithClassNames<undefined>

/**
 * Logo — the StarCi brand mark: a brand-pink circuit-traced "C" + corner circuit
 * nodes, on a transparent background (no dark square), so the pink mark sits on
 * the nav/footer/splash surface directly. Inlined as SVG (crisp at any size, no
 * HTTP round-trip).
 *
 * Square (1:1), single fixed colour (brand pink — reads on light OR dark surface).
 * Sizing is caller-controlled: pass a height (e.g. `h-8`) and the width follows
 * (`w-auto`). Under a `flex-col` / `items-stretch` ancestor the browser still
 * stretches width regardless of ratio — such callers add `self-start` themselves.
 *
 * @param props.className - sizing / placement utilities for the root svg.
 */
export const Logo = ({ className }: LogoProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="512"
            height="512"
            className={cn("h-8 w-auto shrink-0", className)}
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
