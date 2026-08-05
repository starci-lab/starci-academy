import React from "react"
import { cn } from "@heroui/react"
import type { ReactNode } from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { ChipTone, IconComponent } from "@sb-components/atoms/chips/Chip/Chip"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `EnumChip` — a `Chip` whose tone / label / optional tooltip / optional leading icon come
 * from a per-value lookup (`map[value]`), so a domain badge shrinks to just its map table plus
 * this delegate. Props: `value`, `map` (two halves of one lookup), `isSkeleton`,
 * `className`/`classNames`.
 */

/**
 * HeroUI soft-chip colors usable by an {@link EnumChip}.
 *
 * Alias, not a redeclaration: the exact same five values `Chip`'s own
 * `ChipTone` already carries.
 *
 * Aliases `ChipTone` specifically (NOT `AlertStatus`): `entry.color` flows
 * straight into `Chip`'s `tone`, a vendor-constrained prop — `ChipTone` is the
 * one guaranteed to match it 1:1.
 */
export type EnumChipColor = ChipTone

/**
 * The ONLY icons an {@link EnumChipEntry} can name — a CLOSED set, not an
 * arbitrary `IconComponent`. A string selector like `ListMark`
 * (`SurfaceCard.tsx`'s own "check"/"cross"/"pending"/"none" vocabulary), NOT
 * a raw icon reference — narrowing to a curated set is the whole point of
 * "universal" symbols (check/cross, nothing caller-chosen). Extend this
 * union the day a THIRD symbol earns the same bar, don't loosen the type.
 */
export type EnumChipIcon = "check" | "cross"

const ENUM_CHIP_ICON_MAP: Record<EnumChipIcon, IconComponent> = {
    check: CheckCircleIcon,
    cross: XCircleIcon,
}

/** One enum value's chip presentation. */
export interface EnumChipEntry {
    /** Soft chip color. Omit to use the Chip default. */
    color?: EnumChipColor
    /** Visible label (already localized by the caller). */
    label: ReactNode
    /** Optional tooltip (already localized); wraps the chip in a Tooltip when set. */
    tooltip?: ReactNode
    /**
     * Optional leading icon — one of {@link EnumChipIcon}, not a component.
     * Omit for every existing map entry that never had one; only add where
     * the value itself is a "universal" symbol, e.g. a failed/not-passed
     * verdict.
     */
    icon?: EnumChipIcon
}

/** Props for {@link EnumChip}. */
export interface EnumChipProps<E extends string> {
    /** The current enum value; looked up in {@link map}. */
    value: E
    /** Map from enum value to presentation (accepts Partial — unhandled values throw). */
    map: Partial<Record<E, EnumChipEntry>>
    /**
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     * Kept only for the two `_legacy` callers (`HostPlatformChip`, `EntityResultRow`)
     * that still pass a free-form string; `_legacy` is off-limits to edit, so this
     * escape stays until those callers are retired.
     */
    className?: string
    /**
     * Extra classes on the chip. Prefer this over `className`; the string form is going
     * away. This value is handed straight to `Chip`'s own closed `classNames` union, so
     * an unconstrained string here would only fail one tier down.
     */
    classNames?: Array<AllowedClassName>
    /** When `true`, renders the skeleton placeholder (a chip-shaped pill) instead of the real chip. */
    isSkeleton?: boolean
}

/**
 * The canonical "enum → soft chip" composite: a `Chip` whose
 * tone / label / optional tooltip / optional leading icon come from a per-value map.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width.
 *
 * Each entry can carry an optional per-value `icon` — most maps stay text-only;
 * a value only gets an icon when it is a "universal" symbol (check/cross), not a habit.
 *
 * @param props - {@link EnumChipProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "EnumChip" } as const

/** Chip whose tone, label, tooltip, and icon come from `map[value]`. */
export const EnumChip = <E extends string>({ value, map, className, classNames, isSkeleton }: EnumChipProps<E>) => {
    const wrapChip = (chip: React.ReactElement) => {
        const cls = cn(className, classNames)
        return cls ? <div className={cls}>{chip}</div> : chip
    }
    if (isSkeleton) {
        // The atom's shimmer matches the real chip box, so no `h-6` patch is needed
        // here — a call site having to patch the atom's shape is the sign the atom is
        // wrong, not this spot. `Chip` no longer takes placement classes; wrap instead.
        return wrapChip(<Chip isSkeleton />)
    }
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = wrapChip(
        <Chip
            tone={entry.color ?? "default"}
            text={entry.label}
            icon={entry.icon != null ? ENUM_CHIP_ICON_MAP[entry.icon] : undefined}
        />,
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip label={entry.tooltip}>{chip}</Tooltip>
    )
}
