import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * COMPOSITE — "N points", the free-form point value a grading row is worth. Renders as
 * accent TEXT, never a `Chip` (§2a: a point count has no closed set of values, so it is
 * not a chip-shaped enum). See the component's own file header for the §2d neo this
 * composite exists to close — two blocks used to render the same info-type as two
 * different elements before this became the single owner of the shape.
 */

/** Props for the {@link ScoreValue} composite. */
export interface ScoreValueProps {
    /** Points this row is worth. A free-form scalar, not an enum — never a chip (§2a). */
    points: number
    /** Unit word appended after the number. Defaults to `"points"`. */
    unit?: string
    /** `true` → render the skeleton mirror bar instead of the number. */
    isSkeleton?: boolean
}

/**
 * "N points" as accent text — `size="xs"` (trailing value beside a dense row's
 * title, same tier as `Chip`'s replaced pill) + `weight="medium"` (never
 * `bold`, which canon forbids alongside `body-xs`) + `tabularNums` (a column
 * of scores lines up).
 *
 * @param props - {@link ScoreValueProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ScoreValue" } as const

export const ScoreValue = ({ points, unit = "points", isSkeleton = false }: ScoreValueProps) => (
    <Typography
        size="xs"
        weight="medium"
        tabularNums
        isSkeleton={isSkeleton}
        classNames={isSkeleton ? ["w-1/4"] : undefined}
        text={`${points} ${unit}`}
    />
)
