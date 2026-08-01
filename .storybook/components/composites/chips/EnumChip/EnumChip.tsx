import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { ChipTone, IconComponent } from "@sb-components/atoms/chips/Chip/Chip"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/EnumChip`. Authored in Storybook (not `src`); synced later.
 */

/**
 * HeroUI soft-chip colors usable by an {@link EnumChip}.
 *
 * Alias, not a redeclaration (per the teacher's final call, 2026-07-29): the exact same five
 * values `Chip`'s own `ChipTone` already carries — this used to need
 * `COLOR_TO_TONE` to translate `default → neutral` between two hand-typed
 * copies of the same vocabulary. Both sides being the same alias makes the
 * translation a no-op, so it is gone, not renamed.
 *
 * Aliases `ChipTone` specifically (NOT `AlertStatus`, round-9, 2026-07-30):
 * `entry.color` flows straight into `Chip`'s `tone`, a vendor-constrained prop
 * — `ChipTone` is the one guaranteed to match it 1:1 (see `ChipTone`'s own
 * note on why it split from `AlertStatus` when `info` was added there).
 */
export type EnumChipColor = ChipTone

/**
 * The ONLY icons an {@link EnumChipEntry} can name — a CLOSED set, not an
 * arbitrary `IconComponent`. AUDIT 2026-07-30 (feedback ChallengePage/Graded
 * round-2, per the teacher's final call): a string selector like `ListMark`
 * (`SurfaceCard.tsx`'s own "check"/"cross"/"pending"/"none" vocabulary), NOT
 * a raw icon reference — narrowing to a curated set is the whole point of
 * "universal" symbols (§2a: check/cross, nothing caller-chosen). Extend this
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
     * verdict (AUDIT 2026-07-30, feedback ChallengePage/Graded round-2).
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
     * escape stays until those callers are retired (ATOM-5 narrowing pass, 2026-07-31).
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
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The canonical "enum → soft chip" composite: a `Chip` whose
 * tone / label / optional tooltip / optional leading icon come from a per-value map.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): gained `icon` per entry
 * (was "text-only, no leading icon"). Additive, per-value — most maps stay text-only;
 * a value only gets an icon when it is a "universal" symbol (check/cross), not a habit.
 *
 * ⚠️ Changed 2026-07-26: this used to build on top of `StatusChip` — that component was
 * deleted because it was just `Chip` with `tone` hardcoded, adding no behavior of its own.
 * Now it calls the atom directly.
 *
 * @param props - {@link EnumChipProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "EnumChip" } as const

export const EnumChip = <E extends string>({ value, map, className, classNames, isSkeleton }: EnumChipProps<E>) => {
    if (isSkeleton) {
        // No longer patching in `h-6` here: the atom's shimmer used to stand `h-7` tall,
        // 4px off from the real chip box, so the call site had to paper over the shape.
        // The atom was fixed (2026-07-26) — a call site having to patch the atom's shape
        // is itself the sign the atom is wrong, not this spot.
        return <Chip isSkeleton className={className} classNames={classNames} />
    }
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <Chip
            tone={entry.color ?? "default"}
            className={className}
            classNames={classNames}

            text={entry.label}
            icon={entry.icon != null ? ENUM_CHIP_ICON_MAP[entry.icon] : undefined}
        />
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip label={entry.tooltip}>{chip}</Tooltip>
    )
}
