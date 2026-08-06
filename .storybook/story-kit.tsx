import React from "react"
import { Label, Typography } from "@heroui/react"

/**
 * Shared SCAFFOLD helpers for GALLERY stories — render every variant/state of a component in
 * ONE story, laid out identically everywhere.
 *
 * Deliberately NOT called "layout primitives": these are the story's own scaffold, not a tier
 * of the tree. Reaching for the real frame tier here would make an ATOM's story import a
 * FRAME just to line up five demo chips, which inverts the tiers inside the drawing.
 *
 * Before this, each gallery story hand-rolled its own `flex flex-col gap-6/gap-3`
 * nest, so no two galleries lined up the same way (the jumble the team saw).
 * A story that shows all variants should now be: one `render` returning `<Gallery>`
 * mapping a variant list through `<Variant label>` — no ad-hoc divs, consistent
 * rhythm by construction.
 *
 * Use for enum/tone/size explosions and the state-matrix (empty/1/N/loading/error/
 * hover/selected) — anything you compare SIDE BY SIDE. Keep a SEPARATE story only
 * for interactive specimens (click/type) or full-bleed surfaces that need the
 * whole canvas.
 */

/** Props for {@link Gallery}. */
export interface GalleryProps {
    /** The rows being shown side by side. */
    children: React.ReactNode
}

/** The outer stack for a gallery story — evenly-spaced variant sections. */
export const Gallery = ({ children }: GalleryProps) => (
    <div className="flex w-full flex-col gap-6">{children}</div>
)

/** Props for {@link Variant}. */
export interface VariantProps {
    /** Specimen label. */
    label: string
    /** Optional muted hint saying WHEN to use this specimen. */
    hint?: string
    /** The specimen itself. */
    children: React.ReactNode
}

/**
 * One labelled specimen inside a {@link Gallery}: a `Label` (+ optional muted
 * hint saying WHEN to use it), then the block itself.
 */
export const Variant = ({ label, hint, children }: VariantProps) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {hint ? (
                <Typography type="body-sm" color="muted">
                    {hint}
                </Typography>
            ) : null}
        </div>
        {children}
    </div>
)

/** Props for {@link VariantRow}. */
export interface VariantRowProps {
    /** Row label. */
    label: string
    /** Optional muted hint saying WHEN to use these specimens. */
    hint?: string
    /** The specimens in the wrapping row. */
    children: React.ReactNode
}

/**
 * A row of specimens under one label — for compact peers (chips, badges, sizes)
 * that read better in a wrapping row than stacked. Same header as {@link Variant}.
 */
export const VariantRow = ({ label, hint, children }: VariantRowProps) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {hint ? (
                <Typography type="body-sm" color="muted">
                    {hint}
                </Typography>
            ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
)
