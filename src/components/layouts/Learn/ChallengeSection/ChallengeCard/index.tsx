"use client"

import { StarCiCard, StarCiCardBody, StarCiChip } from "@/components/atomic"
import { useChallengeDisclosure } from "@/hooks/singleton"
import { ChallengeDifficulty, ChallengeEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setChallengeId } from "@/redux/slices"
import { ListNumbersIcon, SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { Spacer } from "@heroui/react"

export interface ChallengeCardProps {
    /** One module challenge block from API. */
    challenge: ChallengeEntity
}

/**
 * Single challenge row in the Learn “Challenges” tab; opens full detail in ChallengeModal.
 */
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
    const t = useTranslations()
    const { onOpen } = useChallengeDisclosure()
    const dispatch = useAppDispatch()

    const difficultyName = useMemo(() => {
        switch (challenge.difficulty) {
        case ChallengeDifficulty.Medium:
            return "challenge.difficulty.medium"
        case ChallengeDifficulty.Hard:
            return "challenge.difficulty.hard"
        default:
            return "challenge.difficulty.easy"
        }
    }, [challenge.difficulty, t])
    return (
        <StarCiCard
            fullWidth
            isPressable
            onPress={() => {
                dispatch(setChallengeId(challenge.id))
                onOpen()
            }
            }
        >
            <StarCiCardBody>
                <div>
                    <div className="flex flex-col">
                        <div className="line-clamp-1 font-medium">
                            {challenge.orderIndex + 1}{". "} {challenge.title}</div>
                        <Spacer y={3} />
                        <div className="line-clamp-2 text-justify text-sm italic text-foreground-500">
                            {challenge.description}
                        </div>
                        <Spacer y={3} />
                        <div className="flex flex-wrap gap-2">
                            <StarCiChip
                                startContent={<TrophyIcon className="size-5" />}
                                color="secondary"
                                size="sm"
                                variant="flat"
                            >
                                {t("challenge.score", {
                                    score: challenge.score,
                                })}
                            </StarCiChip>
                            <StarCiChip
                                startContent={<SwordIcon className="size-5" />}
                                color="danger"
                                size="sm"
                                variant="flat"
                            >
                                {t(difficultyName)}
                            </StarCiChip>
                            <StarCiChip
                                startContent={<ListNumbersIcon className="size-5" />}
                                color="warning"
                                size="sm"
                                variant="flat"
                            >
                                {t("challenge.steps.count", {
                                    count: challenge.steps?.length ?? 0,
                                })}
                            </StarCiChip>
                        </div>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}
