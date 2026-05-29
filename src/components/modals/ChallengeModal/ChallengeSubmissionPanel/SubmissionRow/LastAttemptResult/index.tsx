"use client"

import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"

/** Props for {@link LastAttemptResult}. */
export interface LastAttemptResultProps {
    /** Score earned on the most recent grading attempt. */
    earnedScore: number
    /** Maximum score the requirement is worth. */
    maxScore: number
    /** Fraction of the max score required to pass (0..1). */
    passThreshold: number
}

/**
 * Pass/fail chip plus the earned-vs-required score line for a submission's last attempt.
 *
 * Presentational: derives pass state from the props; no logic.
 * @param props - {@link LastAttemptResultProps}
 */
export const LastAttemptResult = ({
    earnedScore,
    maxScore,
    passThreshold,
}: LastAttemptResultProps) => {
    const t = useTranslations()
    const requiredScore = maxScore * passThreshold
    const isPassed = earnedScore >= requiredScore
    return (
        <div>
            <div className="border-t border-divider" />
            <div className="h-3" />
            <div className="flex gap-2 text-sm text-muted items-center">
                <Chip color={isPassed ? "success" : "danger"} size="sm" variant="soft">
                    <Chip.Label>
                        {t(isPassed ? "challenge.pass" : "challenge.fail")}
                    </Chip.Label>
                </Chip>
                <span className="text-xs">
                    {t.rich("challenge.submissionModal.lastAttemptScoreWithRequirement", {
                        earned: earnedScore,
                        max: maxScore,
                        required: requiredScore,
                        n: (chunks) => (
                            <span className="text-foreground">{chunks}</span>
                        ),
                    })}
                </span>
            </div>
        </div>
    )
}
