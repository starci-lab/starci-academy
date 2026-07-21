import React from "react"
import { Label, Typography } from "@heroui/react"

/**
 * Shared layout primitives for GALLERY stories — render every variant/state of a
 * block in ONE story, laid out identically everywhere.
 *
 * Before this, each gallery story hand-rolled its own `flex flex-col gap-6/gap-3`
 * nest, so no two galleries lined up the same way (the "tạp nham" the team saw).
 * A story that shows all variants should now be: one `render` returning `<Gallery>`
 * mapping a variant list through `<Variant label>` — no ad-hoc divs, consistent
 * rhythm by construction.
 *
 * Use for enum/tone/size explosions and the state-matrix (empty/1/N/loading/error/
 * hover/selected) — anything you compare SIDE BY SIDE. Keep a SEPARATE story only
 * for interactive specimens (click/type) or full-bleed surfaces that need the
 * whole canvas.
 */

/** The outer stack for a gallery story — evenly-spaced variant sections. */
export const Gallery = ({ children }: { children: React.ReactNode }) => (
    <div className="flex w-full flex-col gap-6">{children}</div>
)

/**
 * One labelled specimen inside a {@link Gallery}: a `Label` (+ optional muted
 * hint saying WHEN to use it), then the block itself.
 */
export const Variant = ({
    label,
    hint,
    children,
}: {
    label: string
    hint?: string
    children: React.ReactNode
}) => (
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

/**
 * A row of specimens under one label — for compact peers (chips, badges, sizes)
 * that read better in a wrapping row than stacked. Same header as {@link Variant}.
 */
export const VariantRow = ({
    label,
    hint,
    children,
}: {
    label: string
    hint?: string
    children: React.ReactNode
}) => (
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
