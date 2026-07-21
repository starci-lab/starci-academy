import React from "react"
import { Chip, Tooltip, cn } from "@heroui/react"
import type { ReactNode } from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/EnumChip`. Authored in Storybook (not `src`); synced later.
 */

/** HeroUI soft-chip colors usable by an {@link EnumChip}. */
export type EnumChipColor = "default" | "success" | "warning" | "danger" | "accent"

/** One enum value's chip presentation. */
export interface EnumChipEntry {
    /** Soft chip color. Omit to use the Chip default. */
    color?: EnumChipColor
    /** Visible label (already localized by the caller). */
    label: ReactNode
    /** Optional leading icon — the CALLER sizes it (this primitive never forces a size). */
    icon?: ReactNode
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
}

/**
 * The canonical "enum → soft chip" primitive: a `Chip variant="soft" size="sm"` whose
 * color / label / optional leading icon / optional tooltip come from a per-value map.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width or icon size.
 *
 * @param props - {@link EnumChipProps}
 */
export const EnumChip = <E extends string>({ value, map, className }: EnumChipProps<E>) => {
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <Chip color={entry.color} size="sm" variant="soft" className={cn(className)}>
            {entry.icon}
            <Chip.Label>{entry.label}</Chip.Label>
        </Chip>
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
