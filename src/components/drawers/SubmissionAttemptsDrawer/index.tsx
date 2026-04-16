"use client"

import React, { useMemo } from "react"
import { Button, Card, Chip, Drawer } from "@heroui/react"
import { useFeedbackDetailsOverlayState, useSubmissionAttemptsOverlayState } from "@/hooks/singleton"
import { Spacer } from "@/components/reuseable"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSubmissionAttemptId } from "@/redux/slices"
import { useTranslations } from "next-intl"

/**
 * Drawer listing submission attempts for the active challenge submission.
 */
export const SubmissionAttemptsDrawer = () => {
    const dispatch = useAppDispatch()
    const t = useTranslations()
    const { isOpen, onOpenChange } = useSubmissionAttemptsOverlayState()
    const { onOpen: onOpenFeedbackDetails } = useFeedbackDetailsOverlayState()
    const submissionAttempts = useAppSelector((state) => state.submissionAttempt.submissionAttempts)
    const challengeSubmissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const challengeSubmissionId = useAppSelector((state) => state.challenge.challengeSubmissionId)
    const challengeSubmission = useMemo(() => challengeSubmissions?.find((challengeSubmission) => challengeSubmission.id === challengeSubmissionId), [challengeSubmissions, challengeSubmissionId])
    const getScoreColor = (score: number | null): "danger" | "success" | "warning" => {
        if (score === null) return "danger"
        if (score >= 80) return "success"
        if (score >= 50) return "warning"
        return "danger"
    }
    return (
        <Drawer >
            <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
                <Drawer.Content  placement="right">
                    <Drawer.Dialog>
                        <Drawer.CloseTrigger />
                        <Drawer.Header>
                            <Drawer.Heading className="text-lg font-bold">
                                {t("submissionAttempts.title")}
                            </Drawer.Heading>
                        </Drawer.Header>
                        <Drawer.Body>
                            <div>
                                <div className="text-sm text-foreground-500">{t("submissionAttempts.subtitle")}</div>
                                <Spacer y={2} />
                                <div className="flex flex-col gap-3">
                                    {
                                        submissionAttempts.map(
                                            (submissionAttempt) => (
                                                <Card key={submissionAttempt.id} className="border border-divider bg-transparent">
                                                    <Card.Content>
                                                        <div>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="text-sm">
                                                                    {t("submissionAttempts.attemptLine", { number: submissionAttempt.attemptNumber })}
                                                                </div>
                                                                <Chip color={getScoreColor(submissionAttempt.score)} size="sm" variant="soft">
                                                                    <Chip.Label>
                                                                        {submissionAttempt.score}/{challengeSubmission?.score}
                                                                    </Chip.Label>
                                                                </Chip>
                                                            </div>
                                                            <Spacer y={3} />
                                                            <div className="text-xs text-foreground-500">{submissionAttempt.shortFeedback}</div>
                                                            <Spacer y={3} />
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    onPress={() => {
                                                                        dispatch(setSubmissionAttemptId(submissionAttempt.id))
                                                                        onOpenFeedbackDetails()
                                                                    }}
                                                                    variant="tertiary"
                                                                >
                                                                    {t("submissionAttempts.viewDetails")}
                                                                </Button>
                                                                <Button
                                                                    onPress={() => {
                                                                        window.open(submissionAttempt.submissionUrl, "_blank")
                                                                    }}
                                                                    variant="ghost"
                                                                >
                                                                    {t("submissionAttempts.viewSubmission")}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </Card.Content>
                                                </Card>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </Drawer.Body>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
