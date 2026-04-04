"use client"

import React, { useMemo } from "react"
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
    const { isOpen, onOpenChange } = useChallengeDisclosure()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const references = useMemo(() => _.cloneDeep(challenge?.references ?? []), [challenge?.references])
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
                                    count: steps.length,
                                })}
                            </StarCiChip>
                        </div>
                    }
                />
                <StarCiModalBody>
                    <StarCiScrollShadow hideScrollBar>
                        <ChallengeCard />
                        <Spacer y={6} />
                        {challenge?.requirements?.trim() ? (
                            <>
                                <MarkdownContent markdown={challenge.requirements} />   
                            </>
                        ) : null}
                        {steps.length > 0 ? (
                            <>
                                <Spacer y={6} />
                                <div className="font-semibold text-foreground">
                                    {t("challenge.steps.title")}
                                </div>
                                <Spacer y={3} />
                                <div className="flex flex-col gap-6">
                                    {steps.map((step) => (
                                        <div key={step.id}>
                                            {step.title?.trim() ? (
                                                <div className="text-sm text-foreground-500">
                                                    {`${step.orderIndex + 1}. ${step.title}`}
                                                </div>
                                            ) : null}
                                            <Spacer y={1.5} />
                                            <div className="border border-divider rounded-large p-3">
                                                <MarkdownContent
                                                    markdown={step.body ?? ""}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                        <ReferenceLinks
                            references={references ?? []}
                            titleKey="reference.title"
                        />
                    </StarCiScrollShadow>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
