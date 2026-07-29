import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ScoreValue: "N điểm", the free-form point
 * value a grading row is worth. Canon §2a puts this on the SCALAR side of the
 * chip/text split — a rubric point count has no closed set of values (it is
 * not an enum/status/badge), so it renders as accent TEXT, never a `Chip`.
 *
 * ⭐ NEO (2026-07-29, thầy chốt): the exact same "N điểm" trailing slot used
 * to render as a `Chip` in `ChallengeBrief`/`TaskBriefBody`/
 * `PersonalProjectTaskPage` while `ChallengeDeliverableList` rendered the same
 * info-type as plain accent text — a §2d violation (same info-type, two
 * elements). This composite is the single owner of that shape so no future
 * block can drift back to a chip: callers only ever pass a number, never
 * choose the element themselves.
 */

/** Props for the {@link ScoreValue} composite. */
export interface ScoreValueProps {
    /** Points this row is worth. A free-form scalar, not an enum — never a chip (§2a). */
    points: number
    /** Unit word appended after the number. Defaults to `"điểm"`. */
    unit?: string
    /** `true` → render the skeleton mirror bar instead of the number. */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * "N điểm" as accent text — `size="xs"` (trailing value beside a dense row's
 * title, same nấc as `Chip`'s replaced pill) + `weight="medium"` (never
 * `bold`, which canon forbids alongside `body-xs`) + `tabularNums` (a column
 * of scores lines up).
 *
 * @param props - {@link ScoreValueProps}
 */
export const ScoreValue = ({ points, unit = "điểm", isSkeleton = false, anatPart }: ScoreValueProps) => (
    <Typography
        size="xs"
        color="accent"
        weight="medium"
        tabularNums
        isSkeleton={isSkeleton}
        className={isSkeleton ? "w-10" : undefined}
        text={`${points} ${unit}`}
        anatPart={anatPart}
    />
)
