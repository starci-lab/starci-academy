import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * BLOCK — `CourseQaEngagementStrip`: the "you're not learning alone" honest
 * aggregate under `CourseQaHeader` on a course Q&A board — enrolled learners,
 * then answered/total questions. See the component file header for the full
 * real-numbers-only contract and the leaf/state judgement call.
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

    return (
        <StackV
            gap={1}
            isSkeleton={isSkeleton}
            items={[
                ...(isSkeleton || hasEnrollment ? [() => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={hasEnrollment ? `${enrollmentCount!.toLocaleString("vi-VN")} learners enrolled in this course` : undefined}

                    />
                )] : []),
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        text={isSkeleton ? undefined : questionLine(totalQuestions, answeredQuestions)}

                    />
                ),
            ]}
        />

    )
}

export { CourseQaEngagementStrip }
