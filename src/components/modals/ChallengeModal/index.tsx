"use client"

import React, { useMemo } from "react"
import { Chip, Modal, ScrollShadow, Surface } from "@heroui/react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks/singleton"
import { ChallengeDifficulty } from "@/modules/types"
import { ListNumbersIcon, SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { ChallengeCard } from "./ChallengeCard"
import _ from "lodash"
import { AppModalHeader } from "../AppModalHeader"

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
    const challenge = useAppSelector((state) => state.challenge.entity)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const references = useMemo(() => _.cloneDeep(challenge?.references ?? []), [challenge?.references])
    const t = useTranslations()
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container" size="full">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader
                            description={
                                <div className="flex flex-wrap justify-center gap-2">
                                    <div className="flex flex-wrap gap-2">
                                        <Chip color="accent" size="sm" variant="soft">
                                            <TrophyIcon className="size-5" />
                                            <Chip.Label>
                                                {t("challenge.score", {
                                                    score: challenge?.score ?? 0,
                                                })}
                                            </Chip.Label>
                                        </Chip>
                                        <Chip color="danger" size="sm" variant="soft">
                                            <SwordIcon className="size-5" />
                                            <Chip.Label>
                                                {t(challengeDifficultyMessageKey(challenge?.difficulty))}
                                            </Chip.Label>
                                        </Chip>
                                        <Chip color="warning" size="sm" variant="soft">
                                            <ListNumbersIcon className="size-5" />
                                            <Chip.Label>
                                                {t("challenge.steps.count", {
                                                    count: steps.length,
                                                })}
                                            </Chip.Label>
                                        </Chip>
                                    </div>
                                </div>
                            }
                            title={challenge?.title ?? ""}
                        />
                        <Modal.Body>
                            <ScrollShadow hideScrollBar={true} className="px-3">
                                <ChallengeCard />
                                <div className="h-6"/>
                                {challenge?.requirements?.trim() ? (
                                    <>
                                        <MarkdownContent markdown={challenge.requirements} />
                                    </>
                                ) : null}
                                {steps.length > 0 ? (
                                    <>
                                        <div className="h-6"/>
                                        <div className="font-semibold text-foreground text-base">
                                            {t("challenge.steps.title")}
                                        </div>
                                        <div className="h-3"/>
                                        <div className="flex flex-col gap-6">
                                            {steps.map((step) => (
                                                <div key={step.id}>
                                                    {step.title?.trim() ? (
                                                        <div className="text-sm text-foreground font-semibold">
                                                            {`${step.orderIndex + 1}. ${step.title}`}
                                                        </div>
                                                    ) : null}
                                                    <div className="h-3"/>
                                                    <Surface className="p-1.5 text-muted rounded-3xl border border-divider" variant="transparent">
                                                        <MarkdownContent
                                                            markdown={step.body ?? ""}
                                                        />
                                                    </Surface>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : null}
                                <ReferenceLinks
                                    references={references ?? []}
                                    titleKey="reference.title"
                                />
                                <div className="h-6"/>
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
