import React from "react"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ScoreValue: "N points", the
 * free-form point value a grading row is worth. A rubric point count has no
 * closed set of values (it is not an enum/status/badge), so it renders as
 * TEXT, never a `Chip`.
 *
 * * RULING (2026-07-29, teacher's call): the exact same "N points" trailing slot
 * used to render as a `Chip` in `ChallengeBrief`/`TaskBriefBody`/
 * `PersonalProjectTaskPage` while `ChallengeDeliverableList` rendered the same
 * info-type as plain text — a §2d violation (same info-type, two elements).
 * This composite is the single owner of that shape so no future block can
 * drift back to a chip: callers only ever pass a number, never choose the
 * element themselves.
 *
 * * AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1 — see
 * `.artifacts/feedback/2026-07-29-challengepage-graded/round-1.md`): removed
 * `color="accent"`. The old ruling cited "Canon §2a" to justify accent — that
 * section number belongs to `principles.md`, which is RETIRED. Same-page
 * counter-evidence: `ChallengeHeader.tsx` correctly keeps its total "N points"
 * at `muted`, reasoning "a raw number is not a classifying fact" — the same
 * logic applies to ScoreValue. `color` axis (§3a): a number attached to an
 * active control, carrying real informational value => `default` (no `color`
 * declared), not `accent` nor `muted`.
 */

/** Props for the {@link ScoreValue} composite. */
export interface ScoreValueProps {
    /** Points this row is worth. A free-form scalar, not an enum — never a chip (§2a). */
    points: number
    /** Unit word appended after the number. Defaults to `"points"`. */
    unit?: string
    /** `true` -> render the skeleton mirror bar instead of the number. */
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

/** Renders a "N points"-style score as accent, tabular-nums text. */
export const ScoreValue = ({ points, unit = "points", isSkeleton = false}: ScoreValueProps) => (
    <Typography
        size="xs"
        weight="medium"
        tabularNums
        isSkeleton={isSkeleton}
        text={`${points} ${unit}`}
    />
)
