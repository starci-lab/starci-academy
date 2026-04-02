"use client"

import React, { useMemo } from "react"
import {
    StarCiChip,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
} from "../../atomic"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useChallengeDisclosure } from "@/hooks/singleton"
import { ChallengeDifficulty } from "@/modules/types"
import { ListNumbersIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { Spacer } from "@heroui/react"
import { useAppSelector } from "@/redux"

const challengeDifficultyMessageKey = (d: ChallengeDifficulty | undefined) => {
    switch (d) {
    case ChallengeDifficulty.Medium:
        return "course.modules.challengeDifficultyMedium"
    case ChallengeDifficulty.Hard:
        return "course.modules.challengeDifficultyHard"
    default:
        return "course.modules.challengeDifficultyEasy"
    }
}

export const ChallengeModal = () => {
    const { isOpen, onOpenChange } = useChallengeDisclosure()
    const t = useTranslations()
    const challenge = useAppSelector((state) => state.modal.challengeData?.data)

    const steps = useMemo(() => {
        return [...(challenge?.steps ?? [])].sort(
            (a, b) => a.orderIndex - b.orderIndex,
        )
    }, [challenge?.steps])

    const inputs = useMemo(() => {
        return [...(challenge?.inputs ?? [])].sort(
            (a, b) => a.orderIndex - b.orderIndex,
        )
    }, [challenge?.inputs])

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
                                {t("course.modules.challengeScore", {
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
                                {t("course.modules.challengeInputsCount", {
                                    count: inputs.length,
                                })}
                            </StarCiChip>
                        </div>
                    }
                />
                <StarCiModalBody>
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
                                {t("course.modules.challengeStepsTitle")}
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
                                {t("course.modules.challengeInputsTitle")}
                            </div>
                            <Spacer y={3} />
                            <div className="flex flex-col gap-6">
                                {inputs.map((input, index) => (
                                    <div key={input.id}>
                                        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground-500">
                                            {t("course.modules.challengeInputLabel", {
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
                        references={challenge?.references ?? []}
                        titleKey="course.modules.referencesTitle"
                    />
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
