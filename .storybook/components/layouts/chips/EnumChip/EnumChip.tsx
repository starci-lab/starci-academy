import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { StatusChip, type StatusChipTone } from "@sb-components/atoms/chips/StatusChip/StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/EnumChip`. Authored in Storybook (not `src`); synced later.
 */

/** HeroUI soft-chip colors usable by an {@link EnumChip}. */
export type EnumChipColor = "default" | "success" | "warning" | "danger" | "accent"

/** Maps a raw {@link EnumChipColor} to the {@link StatusChip} tone it composes onto. */
const COLOR_TO_TONE: Record<EnumChipColor, StatusChipTone> = {
    default: "neutral",
    success: "success",
    warning: "warning",
    danger: "danger",
    accent: "accent",
}

/** One enum value's chip presentation. */
export interface EnumChipEntry {
    /** Soft chip color. Omit to use the Chip default. */
    color?: EnumChipColor
    /** Visible label (already localized by the caller). */
    label: ReactNode
    /** Optional tooltip (already localized); wraps the chip in a Tooltip when set. */
    tooltip?: ReactNode
}

/** Props for {@link EnumChip}. */
export interface EnumChipProps<E extends string> {
    /** The current enum value; looked up in {@link map}. */
    value: E
    /** Map from enum value to presentation (accepts Partial — unhandled values throw). */
    map: Partial<Record<E, EnumChipEntry>>
    /** Extra classes on the chip. */
    className?: string
    /** When `true`, renders the skeleton placeholder (a chip-shaped pill) instead of the real chip. */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The canonical "enum → soft chip" primitive: a {@link StatusChip} whose
 * tone / label / optional tooltip come from a per-value map. Text-only — no leading icon.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width.
 *
 * @param props - {@link EnumChipProps}
 */
export const EnumChip = <E extends string>({ value, map, className, isSkeleton, anatPart }: EnumChipProps<E>) => {
    if (isSkeleton) {
        // Atom's own skeleton pill defaults to `h-7`; force back to the registry's
        // `h-6` (24px, matches HeroUI Chip's real box) so the shimmer keeps its
        // exact prior footprint — no visual drift from the swap.
        return <Chip.Base isSkeleton text="" className={cn("h-6", className)} />
    }
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <StatusChip.Base
            tone={entry.color ? COLOR_TO_TONE[entry.color] : "neutral"}
            className={className}
            anatPart={anatPart}
            text={entry.label}
        />
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip.Base label={entry.tooltip}>{chip}</Tooltip.Base>
    )
}
