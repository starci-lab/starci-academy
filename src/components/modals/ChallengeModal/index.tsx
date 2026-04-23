"use client"

import React, { useMemo } from "react"
import { Accordion, cn, Chip, Modal, Surface } from "@heroui/react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks/singleton"
import { ChallengeSubmissionPanel } from "./ChallengeSubmissionPanel"
import { SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import _ from "lodash"
import { difficultyPalette } from "@/components/pallettes"
import { ChallengeDifficulty } from "@/modules/types"

export const ChallengeModal = () => {
    const { isOpen, onOpenChange } = useChallengeOverlayState()
    const t = useTranslations()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const submissions = useAppSelector((state) => state.challenge.challengeSubmissions)
    const config = useAppSelector((state) => state.system.config)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const passThreshold = config?.challenge?.passThreshold ?? 0
    const earnedScore = useMemo(
        () => submissions?.reduce((acc, submission) => acc + (submission.userSubmission?.lastAttempt?.score ?? 0), 0) ?? 0,
        [submissions],
    )
    const maxScore = challenge?.score ?? 0
    const isPassed = useMemo(() => {
        if (!submissions?.length) {
            return false
        }
        return submissions.every((submission) => {
            const required = (submission.score ?? 0) * passThreshold
            const got = submission.userSubmission?.lastAttempt?.score ?? 0
            return got >= required
        })
    }, [passThreshold, submissions])
    const challengeDifficultyKey = useMemo(() => {
        switch (challenge?.difficulty) {
        case ChallengeDifficulty.Easy:
            return "challenge.difficulty.easy"
        case ChallengeDifficulty.Medium:
            return "challenge.difficulty.medium"
        case ChallengeDifficulty.Hard:
            return "challenge.difficulty.hard"
        default:
            return "challenge.difficulty.easy"
        }
    }, [challenge?.difficulty])
    const hasAttempts = useMemo(() => {
        return submissions?.some((submission) => !!submission.userSubmission?.lastAttempt)
    }, [submissions])
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container size="full">
                    <Modal.Dialog className="p-0">
                        <Modal.CloseTrigger />
                        <Modal.Header className="border-b max-w-full w-full">
                            <div className="w-ful h-14 flex flex-col items-center justify-center">
                                <div className="text-center text-base font-semibold text-foreground">
                                    <span className={cn("font-bold", isPassed ? "text-success" : "text-danger")}>{hasAttempts ? 
                                        isPassed ? 
                                            `[${t("challenge.pass")}]`
                                            : `[${t("challenge.fail")}]`
                                        : null
                                    } </span>
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
                                    <Chip className={difficultyPalette[challenge?.difficulty ?? ChallengeDifficulty.Easy].text} variant="soft">
                                        <SwordIcon className="size-5" />
                                        <Chip.Label>
                                            {t(challengeDifficultyKey)}
                                        </Chip.Label>
                                    </Chip>
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="mt-0 max-w-full overflow-hidden p-0">
                            <div className="grid min-h-0 grid-cols-1 lg:h-[calc(100vh-80px)] lg:grid-cols-5">
                                <div className="min-h-0 lg:col-span-2 lg:h-full lg:overflow-hidden">
                                    <div className="flex h-full min-h-0 flex-col">
                                        <div className="min-h-0 flex-1 overflow-y-auto">
                                            <div className="p-3">
                                                <div className="text-base font-semibold text-foreground">{t("challenge.tasks")}</div>
                                                <div className="h-1.5" />
                                                <div className="text-sm text-muted">
                                                    <MarkdownContent markdown={challenge?.requirements?.trim() || t("challenge.empty")} />
                                                </div>
                                                <div className="h-4.5" />
                                                <div className="text-base font-semibold text-foreground">{t("challenge.yourScore")}</div>  
                                                <div className="h-3" />
                                                <div className={cn("text-4xl font-bold", isPassed ? "text-success" : "text-danger")}>
                                                    {t("challenge.submissionModal.scoreFraction", {
                                                        earned: earnedScore,
                                                        max: maxScore,
                                                    })}
                                                </div>
                                                <div className="h-3" />
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xs text-muted">
                                                        {t("challenge.minimumPassRequirementAll")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t"/>
                                            <ChallengeSubmissionPanel  />
                                        </div>
                                    </div>
                                </div>
                                <div className="min-h-0 border-l  lg:col-span-3 lg:h-full lg:overflow-y-auto">
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
                                    <div className="border-t "/>
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
