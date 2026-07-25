import React from "react"
import { Tooltip } from "@heroui/react"
import type { ReactNode } from "react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { StatusChip, type StatusChipTone } from "../StatusChip/StatusChip"

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
        return <Skeleton.Chip className={className} />
    }
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <StatusChip tone={entry.color ? COLOR_TO_TONE[entry.color] : "neutral"} className={className} anatPart={anatPart}>
            {entry.label}
        </StatusChip>
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip>
            <Tooltip.Trigger>{chip}</Tooltip.Trigger>
            <Tooltip.Content>{entry.tooltip}</Tooltip.Content>
        </Tooltip>
    )
}
