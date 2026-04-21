"use client"

import React, { useMemo } from "react"
import { Accordion, Button, Chip, Modal, Surface } from "@heroui/react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { 
    useChallengeOverlayState, 
    useChallengeSubmissionOverlayState, 
    useSubmissionAttemptsOverlayState 
} from "@/hooks/singleton"
import { ChallengeDifficulty } from "@/modules/types"
import { SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import _ from "lodash"

const challengeDifficultyMessageKey = (difficulty: ChallengeDifficulty | undefined) => {
    switch (difficulty) {
    case ChallengeDifficulty.Easy:
        return "challenge.difficulty.easy"
    case ChallengeDifficulty.Medium:
        return "challenge.difficulty.medium"
    case ChallengeDifficulty.Hard:
        return "challenge.difficulty.hard"
    default:
        return "challenge.difficulty.easy"
    }
}

export const ChallengeModal = () => {
    const { isOpen, onOpenChange } = useChallengeOverlayState()
    const challengeSubmissionOverlayState = useChallengeSubmissionOverlayState()
    const submissionAttemptsOverlayState = useSubmissionAttemptsOverlayState()
    const t = useTranslations()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const submissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const minimumPassScore = 16
    const earnedScore = useMemo(
        () => submissions?.reduce((acc, row) => acc + (row.userSubmission?.score ?? 0), 0) ?? 0,
        [submissions],
    )
    const maxScore = challenge?.score ?? 0
    const isPassed = earnedScore > minimumPassScore
    const lastFeedback = useMemo(() => {
        const feedbackCandidates = submissions
            ?.map((submission) => submission.userSubmission?.lastAttempt)
            .filter((attempt) => Boolean(attempt?.shortFeedback))
            .sort((prev, next) => {
                const prevTime = prev?.processedAt ? new Date(prev.processedAt).getTime() : 0
                const nextTime = next?.processedAt ? new Date(next.processedAt).getTime() : 0
                return nextTime - prevTime
            })
        return feedbackCandidates?.[0]?.shortFeedback ?? t("challenge.noFeedback")
    }, [submissions, t])
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="full">
                    <Modal.Dialog className="p-0">
                        <Modal.CloseTrigger />
                        <Modal.Header className="border-b border-divider max-w-full w-full">
                            <div className="w-full h-20 flex flex-col items-center justify-center">
                                <div className="text-center text-base font-semibold text-foreground">
                                    {challenge?.title ?? ""}
                                </div>
                                <div className="h-2" />
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Chip color="accent" variant="soft">
                                        <TrophyIcon className="size-5" />
                                        <Chip.Label>
                                            {t("challenge.score", {
                                                score: challenge?.score ?? 0,
                                            })}
                                        </Chip.Label>
                                    </Chip>
                                    <Chip color="danger" variant="soft">
                                        <SwordIcon className="size-5" />
                                        <Chip.Label>
                                            {t(challengeDifficultyMessageKey(challenge?.difficulty))}
                                        </Chip.Label>
                                    </Chip>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="mt-0 max-w-full overflow-hidden p-0">
                            <div className="grid min-h-0 grid-cols-1 lg:h-[calc(100vh-80px)] lg:grid-cols-5">
                                <div className="min-h-0 lg:col-span-2 lg:h-full lg:overflow-hidden">
                                    <div className="flex h-full min-h-0 flex-col">
                                        <div className="min-h-0 flex-1 overflow-y-auto p-3">
                                            <div className="text-base font-semibold text-foreground">{t("challenge.tasks")}</div>
                                            <div className="h-1.5" />
                                            <div className="text-sm text-muted">
                                                <MarkdownContent markdown={challenge?.requirements?.trim() || t("challenge.empty")} />
                                            </div>
                                            <div className="h-4.5" />
                                            <div className="text-base font-semibold text-foreground">{t("challenge.yourScore")}</div>  
                                            <div className="h-3" />
                                            <div className="text-2xl font-semibold text-foreground">
                                                {t("challenge.submissionModal.scoreFraction", {
                                                    earned: earnedScore,
                                                    max: maxScore,
                                                })}
                                            </div>
                                            <div className="h-3" />
                                            <div className="flex items-center gap-2">
                                                <Chip color={isPassed ? "success" : "danger"} size="sm" variant="soft">
                                                    <Chip.Label>{t(isPassed ? "challenge.pass" : "challenge.fail")}</Chip.Label>
                                                </Chip>
                                                <div className="text-xs text-muted">
                                                    {t("challenge.minimumPassRequirement", { score: minimumPassScore })}
                                                </div>
                                            </div>
                                            <div className="h-6" />
                                            <div className="text-base font-semibold text-foreground">{t("challenge.lastFeedback")}</div>
                                            <div className="h-3" />
                                            <div className="text-xs text-muted">
                                                {lastFeedback}
                                            </div>
                                        </div>      
                                        <div className="mt-3 p-3 border-t border-divider">
                                            <div className="flex gap-2">
                                                <Button className="flex-1" onPress={challengeSubmissionOverlayState.onOpen}>
                                                    {t("challenge.submissionModal.submit")}
                                                </Button>
                                                <Button className="flex-1" variant="secondary" onPress={submissionAttemptsOverlayState.onOpen}>
                                                    {t("challenge.viewAttempts")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min-h-0 border-l border-divider lg:col-span-3 lg:h-full lg:overflow-y-auto">
                                    <Accordion className="px-0" allowsMultipleExpanded>
                                        {steps.map((step) => (
                                            <Accordion.Item key={step.id} id={step.id}>
                                                <Accordion.Heading>
                                                    <Accordion.Trigger className="w-full">
                                                        <div className="flex w-full items-center justify-between gap-2">
                                                            <div className="font-semibold text-base text-foreground">
                                                                {`${step.orderIndex + 1}. ${step.title || t("challenge.steps.label", { index: step.orderIndex + 1 })}`}
                                                            </div>
                                                            <Accordion.Indicator />
                                                        </div>
                                                    </Accordion.Trigger>
                                                </Accordion.Heading>
                                                <Accordion.Panel>
                                                    <Accordion.Body>
                                                        <Surface className="rounded-3xl bg-background px-3 py-1.5">
                                                            <MarkdownContent markdown={step.body ?? ""} />
                                                        </Surface>
                                                    </Accordion.Body>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                    <div className="border-t border-divider"/>
                                    <div className="p-3">
                                        <ReferenceLinks references={_.cloneDeep(challenge?.references ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex)} titleKey="reference.title" />
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
