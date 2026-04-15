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
import { MarkdownContent, ReferenceLinks, Spacer } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks/singleton"
import { ChallengeDifficulty } from "@/modules/types"
import { ListNumbersIcon, SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
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
    const { isOpen, onOpenChange } = useChallengeOverlayState()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const steps = useMemo(() => _.cloneDeep(challenge?.steps ?? []), [challenge?.steps])
    const references = useMemo(() => _.cloneDeep(challenge?.references ?? []), [challenge?.references])
    const t = useTranslations()
    return (
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="full" className="[&_header]:max-w-[768px] [&_header]:mx-auto [&_.modal-body]:max-w-[768px] [&_.modal-body]:mx-auto">
                <StarCiModalHeader
                    title={challenge?.title ?? ""}
                    description={
                        <div className="flex flex-wrap justify-center gap-2">
                            <div className="flex flex-wrap gap-2">
                                <StarCiChip
                                    color="accent"
                                    size="sm"
                                    variant="soft"
                                >
                                    <TrophyIcon className="size-5" />{" "}
                                    {t("challenge.score", {
                                        score: challenge?.score ?? 0,
                                    })}
                                </StarCiChip>
                                <StarCiChip
                                    color="danger"
                                    size="sm"
                                    variant="soft"
                                >
                                    <SwordIcon className="size-5" />{" "}
                                    {t(challengeDifficultyMessageKey(challenge?.difficulty))}
                                </StarCiChip>
                                <StarCiChip
                                    color="warning"
                                    size="sm"
                                    variant="soft"
                                >
                                    <ListNumbersIcon className="size-5" />{" "}
                                    {t("challenge.steps.count", {
                                        count: steps.length,
                                    })}
                                </StarCiChip>
                            </div>
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
