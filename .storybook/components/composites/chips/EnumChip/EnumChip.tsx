import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { ChipTone, IconComponent } from "@sb-components/atoms/chips/Chip/Chip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/EnumChip`. Authored in Storybook (not `src`); synced later.
 */

/**
 * HeroUI soft-chip colors usable by an {@link EnumChip}.
 *
 * Alias, not a redeclaration (thầy chốt 2026-07-29): the exact same five
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
 * round-2, thầy chốt): a string selector like `ListMark`
 * (`SurfaceCard.tsx`'s own "check"/"cross"/"pending"/"none" vocabulary), NOT
 * a raw icon reference — narrowing to a curated set is the whole point of
 * "quốc dân" symbols (§2a: check/cross, nothing caller-chosen). Extend this
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
     * the value itself is a "quốc dân" symbol, e.g. a failed/not-passed
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
    /** Extra classes on the chip. */
    className?: string
    /** When `true`, renders the skeleton placeholder (a chip-shaped pill) instead of the real chip. */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The canonical "enum → soft chip" composite: a `Chip` whose
 * tone / label / optional tooltip / optional leading icon come from a per-value map.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): gained `icon` per entry
 * (was "text-only, no leading icon"). Additive, per-value — most maps stay text-only;
 * a value only gets an icon when it is a "quốc dân" symbol (check/cross), not a habit.
 *
 * ⚠️ Đổi 2026-07-26: trước đây dựng trên `StatusChip` — component đó đã xoá vì nó chỉ là
 * `Chip` khoá cứng `tone`, không thêm hành vi nào. Giờ gọi thẳng atom.
 *
 * @param props - {@link EnumChipProps}
 */
export const EnumChip = <E extends string>({ value, map, className, isSkeleton, anatPart }: EnumChipProps<E>) => {
    if (isSkeleton) {
        // KHÔNG còn đắp `h-6` ở đây nữa: shimmer của atom trước kia cao `h-7`, lệch 4px
        // so với hộp chip thật, nên call-site phải vá hình hộ. Atom đã sửa (2026-07-26) —
        // call-site phải vá hình của atom chính là dấu hiệu atom sai, không phải chỗ này sai.
        return <Chip isSkeleton className={className} anatPart={anatPart} />
    }
    const entry = map[value]
    if (!entry) {
        throw new Error(`EnumChip: no map entry for value "${value}"`)
    }
    const chip = (
        <Chip
            tone={entry.color ?? "default"}
            className={className}
            anatPart={anatPart}
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
