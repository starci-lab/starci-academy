import React from "react"
import type { ReactNode } from "react"
import { Label, cn } from "@heroui/react"
import { SeeMoreLink } from "../navigation/SeeMoreLink/SeeMoreLink"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — shared header of the `Surface*Card` family.
 *
 * Authored inside Storybook (not `src/components`) so the design is iterated here
 * first and synced to `src` later (thầy 2026-07-21: storybook-driven, "sửa
 * storybook trước, đồng bộ với code sau"). Imported by the local SurfaceCard /
 * SurfaceListCard / SurfaceAccordionCard specs so all three share ONE header.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Shared label props every `Surface*Card` accepts to render a header above the surface. */
export interface SurfaceLabelProps {
    /** Section title rendered OUTSIDE (above) the surface. Omit → no header. */
    label?: ReactNode
    /** Passive muted tag pinned RIGHT of the label (a unit/count/currency), NOT an action. */
    labelEnd?: ReactNode
    /** Renders a right-aligned see-more link (semibold accent + hover caret). */
    onSeeMore?: () => void
    /** Text for the see-more link. Defaults to "Xem thêm". */
    seeMoreLabel?: ReactNode
    /** Arbitrary right-aligned slot (a manage button). Wins over `onSeeMore` and `labelEnd`. */
    action?: ReactNode
    /** Render the label as a SUBTLE eyebrow (`text-xs text-muted`, tighter gap). */
    subtleLabel?: boolean
}

/**
 * The label row shared by every `Surface*Card`. Returns `null` when `label` is
 * omitted so a surface with no header renders bare.
 *
 * @param props - {@link SurfaceLabelProps}
 */
export const SurfaceCardHeader = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel = "Xem thêm",
    action,
    subtleLabel = false,
}: SurfaceLabelProps) => {
    if (label == null) return null
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
                {subtleLabel ? (
                    <span className="truncate text-xs text-muted">{label}</span>
                ) : (
                    <Label>{label}</Label>
                )}
            </div>
            {action ?? (onSeeMore ? (
                <SeeMoreLink onPress={onSeeMore} size={subtleLabel ? "xs" : "sm"}>{seeMoreLabel}</SeeMoreLink>
            ) : labelEnd != null ? (
                <span className={cn("shrink-0 text-muted", subtleLabel ? "text-xs" : "text-sm")}>{labelEnd}</span>
            ) : null)}
        </div>
    )
}

/** The `gap` between a {@link SurfaceCardHeader} and its surface — `gap-2` subtle, `gap-3` full. */
export const surfaceSectionGap = (subtleLabel: boolean | undefined) => (subtleLabel ? "gap-2" : "gap-3")

/**
 * The shared `Surface*Card` frame class — `rounded-3xl bg-surface` + a BORDER XOR the
 * elevation SHADOW (bordered = surface-in-surface: a border replaces the shadow that
 * renders invisible on a parent surface). Was copy-pasted verbatim in SurfaceCard /
 * SurfaceListCard / SurfaceAccordionCard / CrossListCard — now ONE source. Callers add
 * their own `overflow-hidden` / padding.
 */
export const surfaceFrame = (bordered?: boolean) =>
    cn("rounded-3xl bg-surface", bordered ? "border border-default" : "shadow-surface")
