"use client"

import React, { useEffect } from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — AnatomyOverlay: an ABSOLUTE annotation drawn ON
 * TOP of a component (a dashed outline + a corner tag naming it), so it never
 * touches the component's layout. Drop it as a child of a `position: relative`
 * root that ALSO carries `data-anat` (the hover target). Colour = TIER
 * (accent=primitive · green=design · amber=block).
 *
 * Interactions (via injected CSS, keyed on `data-anat`):
 * - HOVER a component → its NESTED overlays fade out (peel one layer), so you can
 *   read that level cleanly; the hovered box keeps its own tag.
 * - CLICK a tag with `href` → opens that component's own story (target="_top").
 *
 * A dev/spec tool, never production UI. NO `@/components` imports.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which tier the annotated component is — drives the tag/outline colour. */
export type AnatomyTier = "primitive" | "design" | "block"

const TIER: Record<AnatomyTier, { outline: string; tag: string }> = {
    primitive: { outline: "border-accent", tag: "bg-accent text-accent-foreground" },
    design: { outline: "border-success", tag: "bg-success text-success-foreground" },
    block: { outline: "border-warning", tag: "bg-warning text-warning-foreground" },
}

const STYLE_ID = "anatomy-overlay-css"
const CSS = `
[data-anat-ov]{transition:opacity .15s ease}
[data-anat]:hover [data-anat-ov]{opacity:0}
[data-anat]:hover>[data-anat-ov]{opacity:1}
`

/** Inject the hover-peel CSS once per document. */
const useAnatomyCss = () => {
    useEffect(() => {
        if (typeof document === "undefined" || document.getElementById(STYLE_ID)) {
            return
        }
        const el = document.createElement("style")
        el.id = STYLE_ID
        el.textContent = CSS
        document.head.appendChild(el)
    }, [])
}

/** Props for the {@link AnatomyOverlay}. */
export interface AnatomyOverlayProps {
    /** Component name shown in the tag (e.g. "DeckCard"). */
    label: string
    /** Tier → colour. Default "primitive". */
    tier?: AnatomyTier
    /** When set, the tag becomes a link that opens this component's story (top frame). */
    href?: string
}

/**
 * AnatomyOverlay renders two absolutely-positioned, out-of-flow elements meant to
 * sit inside a `relative` + `data-anat` parent: a dashed `inset-0` outline and a
 * corner tag. Because both are `absolute`, they overlay the component WITHOUT
 * changing its layout.
 *
 * @param props - {@link AnatomyOverlayProps}
 */
export const AnatomyOverlay = ({ label, tier = "primitive", href }: AnatomyOverlayProps) => {
    useAnatomyCss()
    const t = TIER[tier]
    return (
        <>
            <span
                aria-hidden
                data-anat-ov
                className={cn("pointer-events-none absolute inset-0 z-40 rounded-[inherit] border-2 border-dashed", t.outline)}
            />
            {href ? (
                <a
                    data-anat-ov
                    href={href}
                    target="_top"
                    className={cn(
                        "absolute -top-2 left-2 z-40 cursor-pointer rounded px-2 font-mono text-xs leading-5 no-underline",
                        t.tag,
                    )}
                >
                    {label}
                </a>
            ) : (
                <span
                    data-anat-ov
                    className={cn(
                        "pointer-events-none absolute -top-2 left-2 z-40 rounded px-2 font-mono text-xs leading-5",
                        t.tag,
                    )}
                >
                    {label}
                </span>
            )}
        </>
    )
}
