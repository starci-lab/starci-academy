import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ScoreValue: "N điểm", the free-form point
 * value a grading row is worth. A rubric point count has no closed set of
 * values (it is not an enum/status/badge), so it renders as TEXT, never a
 * `Chip`.
 *
 * ⭐ NEO (2026-07-29, thầy chốt): the exact same "N điểm" trailing slot used
 * to render as a `Chip` in `ChallengeBrief`/`TaskBriefBody`/
 * `PersonalProjectTaskPage` while `ChallengeDeliverableList` rendered the same
 * info-type as plain text — a §2d violation (same info-type, two elements).
 * This composite is the single owner of that shape so no future block can
 * drift back to a chip: callers only ever pass a number, never choose the
 * element themselves.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1 — xem
 * `.artifacts/feedback/2026-07-29-challengepage-graded/round-1.md`): gỡ
 * `color="accent"`. Neo cũ trích "Canon §2a" để biện minh accent — số mục đó
 * là `principles.md` đã RETIRED. Đối chứng cùng trang: `ChallengeHeader.tsx`
 * giữ đúng "N điểm" tổng ở `muted` với lý do "a raw number is not a
 * classifying fact" — đúng lý lẽ áp cho ScoreValue. Trục `color` (§3a):
 * số dính liền control đang active + mang giá trị thông tin thật ⇒
 * `default` (không khai `color`), không phải `accent` lẫn `muted`.
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
        weight="medium"
        tabularNums
        isSkeleton={isSkeleton}
        classNames={isSkeleton ? ["w-1/4"] : undefined}
        text={`${points} ${unit}`}
        anatPart={anatPart}
    />
)
