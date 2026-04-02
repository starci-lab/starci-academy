"use client"

import React from "react"
import {
    StarCiChip,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiScrollShadow,
} from "../../atomic"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useChallengeDisclosure } from "@/hooks/singleton"
import { ChallengeDifficulty } from "@/modules/types"
import { ListNumbersIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Spacer } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { ChallengeCard } from "./ChallengeCard"

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
    const { isOpen, onOpenChange } = useChallengeDisclosure()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const steps = useAppSelector((state) => state.challenge.entity?.steps ?? [])
    const inputs = useAppSelector((state) => state.challenge.entity?.inputs ?? [])
    const references = useAppSelector((state) => state.challenge.entity?.references ?? [])
    const t = useTranslations()
    return (
        <StarCiModal
            isOpen={isOpen}
            size="full"
            onOpenChange={onOpenChange}
            classNames={{
                header: "max-w-[768px] mx-auto",
                body: "max-w-[768px] mx-auto",
            }}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
                <StarCiModalHeader
                    title={challenge?.title ?? ""}
                    description={
                        <div className="flex flex-wrap justify-center gap-2">
                            <StarCiChip
                                startContent={<TrophyIcon className="size-4" />}
                                color="primary"
                                size="sm"
                                variant="flat"
                            >
                                {t("challenge.score", {
                                    score: challenge?.score ?? 0,
                                })}
                            </StarCiChip>
                            <StarCiChip
                                color="secondary"
                                size="sm"
                                variant="flat"
                            >
                                {t(challengeDifficultyMessageKey(challenge?.difficulty))}
                            </StarCiChip>
                            <StarCiChip
                                startContent={<ListNumbersIcon className="size-4" />}
                                color="warning"
                                size="sm"
                                variant="flat"
                            >
                                {t("challenge.steps.count", {
                                    count: inputs.length,
                                })}
                            </StarCiChip>
                        </div>
                    }
                />
                <StarCiModalBody>
                    <StarCiScrollShadow hideScrollBar>
                        <ChallengeCard />
                        <Spacer y={6} />
                        {challenge?.brief?.trim() ? (
                            <>
                                <div className="text-sm font-medium text-foreground-600">
                                    {challenge.brief}
                                </div>
                                <Spacer y={4} />
                            </>
                        ) : null}
                        <MarkdownContent markdown={challenge?.description ?? ""} />
                        {steps.length > 0 ? (
                            <>
                                <Spacer y={8} />
                                <div className="text-sm font-semibold text-foreground">
                                    {t("challenge.steps.title")}
                                </div>
                                <Spacer y={3} />
                                <div className="flex flex-col gap-6">
                                    {steps.map((step) => (
                                        <div key={step.id}>
                                            {step.title?.trim() ? (
                                                <div className="mb-2 text-sm font-medium text-foreground-700">
                                                    {step.title}
                                                </div>
                                            ) : null}
                                            {step.description?.trim() ? (
                                                <div className="mb-2 text-sm text-foreground-600">
                                                    {step.description}
                                                </div>
                                            ) : null}
                                            <MarkdownContent
                                                className="rounded-medium border border-divider bg-content1/30 p-3"
                                                markdown={step.body ?? ""}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                        {inputs.length > 0 ? (
                            <>
                                <Spacer y={8} />
                                <div className="text-sm font-semibold text-foreground">
                                    {t("challenge.tasks")}
                                </div>
                                <Spacer y={3} />
                                <div className="flex flex-col gap-6">
                                    {inputs.map((input, index) => (
                                        <div key={input.id}>
                                            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground-500">
                                                {t("challenge.steps.label", {
                                                    index: index + 1,
                                                })}
                                            </div>
                                            <MarkdownContent
                                                className="rounded-medium border border-divider bg-content1/30 p-3"
                                                markdown={input.description ?? ""}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                        <ReferenceLinks
                            references={references}
                            titleKey="reference.title"
                        />
                    </StarCiScrollShadow>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
