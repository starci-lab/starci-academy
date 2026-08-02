import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `CourseQaEngagementStrip` — the reassurance aggregate under `CourseQaHeader` on a
 * course Q&A board: two muted lines, enrolled learners and answered/total questions.
 * `enrollmentCount` is optional — the line is dropped when unknown but printed as-is
 * for a real `0`. Zero questions asked reads as "no questions yet" rather than a
 * hollow "0/0 answered". One two-line `StackV` leaf, `gap={1}`.
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
