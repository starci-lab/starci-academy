"use client"

import React from "react"
import { Tooltip } from "@heroui/react"
import type { ReactNode } from "react"
import { Chip, type ChipTone, type IconComponent } from "@/components/atoms/chips/Chip"

/** Soft-chip tones usable by an {@link EnumChip} (mirrors house {@link ChipTone}). */
export type EnumChipColor = ChipTone

/** One enum value's chip presentation. */
export interface EnumChipEntry {
    /** Soft chip tone. Omit to use the Chip default. */
    color?: EnumChipColor
    /** Visible label (already localized by the caller). */
    label: ReactNode
    /**
     * Optional leading icon — a component reference (`SiYoutube`), not a rendered
     * element. The house {@link Chip} atom mounts it at chip scale (contract E).
     */
    icon?: IconComponent
    /** Optional tooltip (already localized); wraps the chip in a Tooltip when set. */
    tooltip?: ReactNode
}

/** Props for {@link EnumChip}. */
export interface EnumChipProps<E extends string> {
    /** The current enum value; looked up in {@link map}. */
    value: E
    /**
     * Map from enum value to presentation. Usually declare it `Record<E, EnumChipEntry>`
     * at the call site to get TS completeness; the prop accepts `Partial` so a domain
     * may intentionally leave some values unhandled (they throw at render, matching the
     * old switch-`default`-throw behavior).
     */
    map: Partial<Record<E, EnumChipEntry>>
}

/**
 * Legacy block-tier "enum → soft chip" primitive still used by domain badges that pass
 * brand {@link IconComponent} refs (LessonVideoKindChip, HostPlatformChip). Appearance
 * lives on `entry.color`; no public className door. Prefer the composites `EnumChip`
 * when the leading glyph is a closed check/cross symbol.
 *
 * @param props - {@link EnumChipProps}
 */
export const EnumChip = <E extends string>({ value, map }: EnumChipProps<E>) => {
    const entry = map[value]
    if (!entry) {
        // exhaustive Record makes this unreachable in typed code; guards a bad runtime value
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <Chip
            tone={entry.color ?? "default"}
            text={entry.label}
            icon={entry.icon}
        />
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
