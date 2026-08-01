import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaEngagementStrip`: the "you are not learning alone" honest aggregate
 * sitting under `CourseQaHeader` on a course Q&A board — two muted lines,
 * enrolled learners and answered/total questions.
 *
 * WHY A BLOCK ON TOP OF `StackV` + `Typography`: neither knows that a Q&A board
 * needs exactly this reassurance ("you are not alone here, and people actually
 * answer"), that the enrollment count is optional data the caller may not have
 * yet, or that an empty board (zero questions asked) must say something honest
 * instead of printing a hollow "0/0 answered". That vocabulary is
 * §14d.1's "a block owns its own wording" — the frame only tracks two lines,
 * the atom only draws muted text.
 *
 * ⭐ REAL NUMBERS ONLY, NO MANUFACTURED PRESENCE (spec's own framing, matches
 * the anti-dark-pattern stance already set by `PhaseScarcityNote` in this same
 * run's catalog — that block goes silent rather than print a fake countdown;
 * this one goes silent on the enrollment line rather than print a fake count).
 *   • `enrollmentCount` is OPTIONAL. When the caller has not resolved it yet
 *     (or the product deliberately withholds it), the line is DROPPED — never
 *     replaced with a placeholder like "a few learners".
 *   • `enrollmentCount = 0` is NOT the same as "unknown" — a real zero is still
 *     a real number and prints as-is (`!= null`, not truthiness).
 *   • Zero questions asked is not a lie to launder into "0/0 answered"
 *     (that phrasing implies unanswered abandonment); the second line swaps to
 *     an honest "no questions yet" instead.
 *
 * 📐 LEAF BY STRUCTURE (§14d.2), matching the spec's single `Default` leaf:
 * every branch here (enrollment line present/absent, empty-board wording,
 * skeleton) swaps WORDING or TOGGLES ONE LINE inside the same two-line
 * `StackV` — none of them change which components are composed — so they are
 * STATES of one leaf, not separate leaves. Compare `FlashcardMasteryStrip`'s
 * `totalReviewed === 0` caption swap, which makes the identical judgement call
 * for the identical reason.
 *
 * ⭐ `gap={1}` (§10c scale), not `"tight"`/`"related"`: the two lines read
 * as ONE aggregate statement about the board's health, the same relationship
 * the scale names as "a title and its subtitle" — not two peer facts that
 * could be reordered, and not two rows of an itemized surface.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link CourseQaEngagementStrip}. */
export interface CourseQaEngagementStripProps {
    /**
     * Learners enrolled in the course this Q&A board belongs to. `undefined` →
     * the caller has no honest number to show yet, so the enrollment line is
     * dropped entirely rather than showing a placeholder. `0` still prints —
     * it's a real fact, not "unknown".
     */
    enrollmentCount?: number
    /** Total questions ever asked on this board. */
    totalQuestions: number
    /** Of {@link CourseQaEngagementStripProps.totalQuestions}, how many have at least one answer. */
    answeredQuestions: number
    /**
     * `true` → both lines shimmer. The flag FLOWS DOWN into the real
     * `Typography` atoms (§12c) rather than a parallel skeleton tree.
     */
    isSkeleton?: boolean
}

/**
 * The board's second line — real answered/total, or an honest admission that
 * nothing has been asked yet. Never a computed ratio from zero questions.
 */
const questionLine = (totalQuestions: number, answeredQuestions: number): string => {
    if (totalQuestions <= 0) {
        return "No questions asked yet"
    }
    return `${answeredQuestions}/${totalQuestions} questions answered`
}

/**
 * The board's honest engagement readout. See the file header for the full
 * contract.
 *
 * @param props - {@link CourseQaEngagementStripProps}
 */
const CourseQaEngagementStrip = ({
    enrollmentCount,
    totalQuestions,
    answeredQuestions,
    isSkeleton = false,
}: CourseQaEngagementStripProps) => {
    const hasEnrollment = enrollmentCount != null

    const lines = (
        <>
            {isSkeleton || hasEnrollment ? (
                <Typography
                    size="sm"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={hasEnrollment ? `${enrollmentCount!.toLocaleString("vi-VN")} learners enrolled in this course` : undefined}

                />
            ) : null}
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}
                text={isSkeleton ? undefined : questionLine(totalQuestions, answeredQuestions)}

            />
        </>
    )

    return (
        <div>
            <StackV gap={1} body={lines} />
        </div>
    )
}

export { CourseQaEngagementStrip }
