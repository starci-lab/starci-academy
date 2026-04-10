"use client"

import React, { useMemo } from "react"
import {
    StarCiDrawer,
    StarCiDrawerContent,
    StarCiDrawerHeader,
    StarCiDrawerBody,
    StarCiCard,
    StarCiCardBody,
    StarCiChip,
    StarCiButton,
} from "../../atomic"
import { useFeedbackDetailsDisclosure, useSubmissionAttemptsDisclosure } from "@/hooks/singleton"
import { Spacer } from "@heroui/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSubmissionAttemptId } from "@/redux/slices"
/**
 * LanguageModal is a modal component that is used to display the language selection.
 */
export const SubmissionAttemptsDrawer = () => {
    const dispatch = useAppDispatch()
    const { isOpen, onOpenChange } = useSubmissionAttemptsDisclosure()
    const { onOpen: onOpenFeedbackDetails } = useFeedbackDetailsDisclosure()
    const submissionAttempts = useAppSelector((state) => state.submissionAttempt.submissionAttempts)
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const challengeSubmissionId = useAppSelector((state) => state.challenge.challengeSubmissionId)
    const challengeSubmission = useMemo(() => challengeSubmissions?.find((challengeSubmission) => challengeSubmission.id === challengeSubmissionId), [challengeSubmissions, challengeSubmissionId])
    const getScoreStyle = (score: number | null) => {
        if (score === null) return "danger"
        if (score >= 80) return "success"
        if (score >= 50) return "warning"
        return "danger"
    }
    return (
        <StarCiDrawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiDrawerContent>
                <StarCiDrawerHeader
                    title="Submission Attempts"
                />
                <StarCiDrawerBody>
                    <div>
                        <div className="text-sm text-foreground-500">Submission Attempts</div>
                        <Spacer y={2} />
                        {
                            submissionAttempts.map(
                                (submissionAttempt) => (
                                    <StarCiCard key={submissionAttempt.id} className="border border-divider bg-transparent" shadow="none">
                                        <StarCiCardBody>
                                            <div>
                                                <div className="flex items-center gap-3 justify-between">
                                                    <div className="text-sm">Attempt {submissionAttempt.attemptNumber}</div>
                                                    <StarCiChip color={getScoreStyle(submissionAttempt.score)} size="sm" variant="flat">
                                                        {submissionAttempt.score}/{challengeSubmission?.score}
                                                    </StarCiChip>
                                                </div>
                                                <Spacer y={3} />
                                                <div className="text-xs text-foreground-500">{submissionAttempt.shortFeedback}</div>
                                                <Spacer y={3} />
                                                <div className="flex items-center gap-2">
                                                    <StarCiButton
                                                        color="primary"
                                                        variant="flat"
                                                        onPress={() => {
                                                            dispatch(setSubmissionAttemptId(submissionAttempt.id))
                                                            onOpenFeedbackDetails()
                                                        }}
                                                    >
                                                        View Details
                                                    </StarCiButton>
                                                    <StarCiButton
                                                        onPress={() => {
                                                            window.open(submissionAttempt.submissionUrl, "_blank")
                                                        }}
                                                        color="primary"
                                                        variant="light"
                                                    >
                                                        View Submission
                                                    </StarCiButton>
                                                </div>
                                            </div>
                                        </StarCiCardBody>
                                    </StarCiCard>
                                )
                            )
                        }
                    </div>
                    <Spacer y={3} />
                    <div>
                    </div>
                </StarCiDrawerBody>
            </StarCiDrawerContent>
        </StarCiDrawer>
    )
}