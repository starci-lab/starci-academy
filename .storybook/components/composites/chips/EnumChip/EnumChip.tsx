import React from "react"
import type { ReactNode } from "react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import type { AlertStatus } from "@sb-components/atoms/feedback/Alert/Alert"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/EnumChip`. Authored in Storybook (not `src`); synced later.
 */

/**
 * HeroUI soft-chip colors usable by an {@link EnumChip}.
 *
 * Alias, not a redeclaration (thầy chốt 2026-07-29): the exact same five
 * values {@link AlertStatus} and `Chip`'s own `ChipTone` already carry — this
 * used to need `COLOR_TO_TONE` to translate `default → neutral` between two
 * hand-typed copies of the same vocabulary. Both sides being the same alias
 * makes the translation a no-op, so it is gone, not renamed.
 */
export type EnumChipColor = AlertStatus

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
 * The canonical "enum → soft chip" composite: a `Chip` whose
 * tone / label / optional tooltip come from a per-value map. Text-only — no leading icon.
 * Domain badges (AI-model category, difficulty, video host …) shrink to just their map
 * table + this delegate. Deliberately does NOT force width.
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
        />
    )
    if (entry.tooltip == null) {
        return chip
    }
    return (
        <Tooltip label={entry.tooltip}>{chip}</Tooltip>
    )
}
