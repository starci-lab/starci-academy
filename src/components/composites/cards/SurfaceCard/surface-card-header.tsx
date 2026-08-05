import React from "react"
import { cn } from "@heroui/react"
import { LinkSeeMore } from "@/components/atoms/navigation/Link"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/**
 * The shared header of the `Surface*Card` family. Imported by SurfaceCard,
 * SurfaceListCard, and SurfaceAccordionCard so all three share ONE header.
 */

/** Shared label props every `Surface*Card` accepts to render a header above the surface. */
export interface SurfaceLabelProps {
    /**
     * Section title rendered OUTSIDE (above) the surface. Omit → no header.
     *
     * `string`, not `ReactNode` (COMPOSITE-8): the header wraps it in `Typography`
     * itself, so `isSkeleton` can reach the text it renders instead of arriving as
     * an already-built node it cannot reopen.
     */
    label?: string
    /** Passive muted tag pinned RIGHT of the label (a unit/count/currency), NOT an action. Text — see {@link SurfaceLabelProps.label}. */
    labelEnd?: string
    /** Renders a right-aligned see-more link (semibold accent + hover caret). */
    onSeeMore?: () => void
    /** Text for the see-more link. Defaults to "See more". */
    seeMoreLabel?: string
    /**
     * Arbitrary right-aligned slot (a manage button). Wins over `onSeeMore` and
     * `labelEnd`.
     *
     * A COMPONENT reference, not a built node (COMPOSITE-8) — the header calls it
     * with `isSkeleton` so it can build its own resting state, the same way it
     * calls every other slot it renders.
     */
    action?: ComponentTypeWithSkeleton
    /** Render the label as a SUBTLE eyebrow (`text-xs text-muted`, tighter gap). */
    subtleLabel?: boolean
    /**
     * `true` → the header row is in the RESTING state: `label` and the slot must turn
     * into shimmer.
     *
     * The flag flows DOWN FROM the parent frame (`SurfaceCard.*`) — the header doesn't
     * know on its own; whoever owns the shape owns that shape's resting state (§12c).
     * The header still keeps the EXACT real line box (`sm` 20px · `xs` 16px) so the
     * layout doesn't jump when data arrives (§8).
     */
    isSkeleton?: boolean
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
    seeMoreLabel = "See more",
    action: Action,
    subtleLabel = false,
    isSkeleton = false,
}: SurfaceLabelProps) => {
    if (label == null) return null
    // Both sides of the row follow `subtleLabel` for text size — ONE shared variable
    // so the two sides can never drift apart.
    const textSize = subtleLabel ? "xs" : "sm"
    // Text goes through the ATOM (§9c), NOT HeroUI `Label` or a `<span>` with
    // classes slapped on. `Label` renders exactly 14px/500/lh-20 =
    // `size="sm" weight="medium"` so the shape doesn't change — but because
    // it's an atom, `isSkeleton` FLOWS STRAIGHT into it instead of forcing
    // the header row to branch off and build its own shimmer bar.
    const labelSlot = (
        <Typography
            size={textSize}
            weight={subtleLabel ? undefined : "medium"}
            color={subtleLabel ? "muted" : undefined}
            truncate
            isSkeleton={isSkeleton}
            text={label}
        />
    )
    const endSlot = Action ? <Action isSkeleton={isSkeleton} /> : (onSeeMore ? (
        // This is an ATOM with its own story ⇒ the node is named so it becomes a
        // clickable DEP in the panel; the badge stops here, no drilling into the
        // atom's insides (§11a).
        <span className="shrink-0">
            <LinkSeeMore onPress={onSeeMore} size={textSize} label={seeMoreLabel} />
        </span>
    ) : labelEnd != null ? (
        // Also goes through the atom, same reason — the flag keeps flowing, not branching.
        <Typography
            size={textSize}
            color="muted"
            isSkeleton={isSkeleton}
            text={labelEnd}
        />
    ) : null)
    return (
        <StackH
            gap={4}
            justify="between"
            principle="content-row"
            items={[
                () => <StackH gap={3} classNames={["min-w-0"]} items={[() => labelSlot]} />,
                () => endSlot,
            ]}
        />
    )
}

/** The `gap` between a {@link SurfaceCardHeader} and its surface — `gap-2` subtle, `gap-3` full. */
export const surfaceSectionGap = (subtleLabel: boolean | undefined) => (subtleLabel ? "gap-2" : "gap-3")

/**
 * Three frame variants of a `Surface*Card` face:
 * - `"surface"` (default) — `shadow-surface`, used when the parent is a bare
 *   `bg-background`.
 * - `"nested"` — a border REPLACES the shadow (`border border-default`, shadow
 *   dropped) — used when this face sits INSIDE another face (a `bg-surface`
 *   panel, a `bg-surface-secondary` bubble, a modal/page card): the shadow sinks
 *   into the parent face so the signal switches to a border instead.
 */
export type SurfaceCardVariant = "surface" | "nested"

/**
 * The shared `Surface*Card` frame class — `rounded-3xl bg-surface` + a BORDER XOR the
 * elevation SHADOW (`variant="nested"` = surface-in-surface: a border replaces the
 * shadow that renders invisible on a parent surface). Callers add their own
 * `overflow-hidden` / padding.
 */
export const surfaceFrame = (variant: SurfaceCardVariant = "surface") =>
    cn("rounded-3xl bg-surface", variant === "nested" ? "border border-default" : "shadow-surface")
