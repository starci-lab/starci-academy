"use client"

import { Cup as TrophyIcon, Flame } from "@gravity-ui/icons"
import React, { useMemo } from "react"
import { Accordion, cn, Chip, Modal, Surface } from "@heroui/react"
import { MarkdownContent, ReferenceLinks, Score } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks"
import { ChallengeSubmissionPanel } from "../ChallengeSubmissionPanel"
import { ChallengeOutputs } from "../ChallengeOutputs"
import { ChallengePrerequisites } from "../ChallengePrerequisites"
import { ChallengeRequirements } from "../ChallengeRequirements"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import _ from "lodash"
import { difficultyPalette } from "@/components/pallettes"
import { ChallengeDifficulty } from "@/modules/types"


/**
 * Legacy (V1) challenge modal — renders the relational requirements/steps/outputs/prerequisites.
 * Selected by {@link ChallengeModal} when the challenge is NOT verified (no SCHEMA V2 payload).
 */
export const ChallengeModalLegacy = () => {
    const { isOpen, setOpen } = useChallengeOverlayState()
    const t = useTranslations()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const completionTasks = useAppSelector((state) => state.challenge.completionTasks)
    const config = useAppSelector((state) => state.system.config)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const challengeRequirements = useMemo(
        () => _.cloneDeep(challenge?.requirements ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex),
        [challenge?.requirements],
    )
    const challengeOutputs = useMemo(
        () => _.cloneDeep(challenge?.outputs ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex),
        [challenge?.outputs],
    )
    const challengePrerequisites = useMemo(
        () => _.cloneDeep(challenge?.prerequisites ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex),
        [challenge?.prerequisites],
    )
    const passThreshold = config?.challenge?.passThreshold ?? 0
    // Challenge-level progress (best score summed across ALL submissions) from `challengeSubmissionProgress`.
    const challengeProgress = useMemo(
        () => completionTasks.find((completionTask) => completionTask.id === challenge?.id) ?? null,
        [completionTasks, challenge?.id],
    )
    // Total score for the whole challenge comes from progress, not from a single submission's last attempt.
    const earnedScore = challengeProgress?.lastScore ?? 0
    const maxScore = challengeProgress?.maxScore ?? challenge?.score ?? 0
    // Title badge ([Pass]/[Fail]/[In progress]) derived from the challenge progress status.
    const statusBadge = useMemo(() => {
        switch (challengeProgress?.status) {
        case "completed":
            return { className: "text-success", label: t("challenge.pass") }
        case "failed":
            return { className: "text-danger", label: t("challenge.fail") }
        case "inProgress":
            return { className: "text-warning", label: t("challenge.inProgress") }
        default:
            return null
        }
    }, [challengeProgress?.status, t])
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

    return (
        <Modal isOpen={isOpen} onOpenChange={setOpen}>
            <Modal.Backdrop>
                <Modal.Container size="full">
                    <Modal.Dialog className="p-0">
                        <Modal.CloseTrigger />
                        <Modal.Header className="border-b max-w-full w-full">
                            <div className="w-full h-14 flex flex-col items-center justify-center">
                                <div className="text-center text-2xl font-bold text-foreground">
                                    {statusBadge ? (
                                        <span className={cn("font-bold", statusBadge.className)}>{`[${statusBadge.label}] `}</span>
                                    ) : null}
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
                                        <Flame className="size-5" />
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
                                                <div className="text-lg font-semibold text-foreground">{t("challenge.tasks")}</div>
                                                <div className="h-4.5" />
                                                <ChallengePrerequisites challengePrerequisites={challengePrerequisites} />
                                                <div className="h-4.5" />
                                                <ChallengeRequirements challengeRequirements={challengeRequirements} />
                                                <div className="h-4.5" />
                                                <ChallengeOutputs challengeOutputs={challengeOutputs} />
                                                <div className="h-6" />
                                                <div className="text-lg font-semibold text-foreground">{t("challenge.yourScore")}</div>
                                                <div className="h-3" />
                                                <Score
                                                    current={earnedScore}
                                                    max={maxScore}
                                                    threshold={passThreshold}
                                                />
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
                                    <Accordion className="px-0" allowsMultipleExpanded defaultExpandedKeys={steps.map(s => s.id)}>
                                        {
                                            _.cloneDeep(steps)
                                                .sort((prev, next) => prev.orderIndex - next.orderIndex)
                                                .map(
                                                    (step) => {
                                                        return (
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
                                                        )
                                                    })}
                                    </Accordion>
                                    <div className="border-t"/>
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
