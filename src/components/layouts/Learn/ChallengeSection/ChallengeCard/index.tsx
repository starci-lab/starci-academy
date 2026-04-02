"use client"

import { StarCiCard, StarCiCardBody, StarCiChip, StarCiImage } from "@/components/atomic"
import { useChallengeDisclosure } from "@/hooks/singleton"
import type { ChallengeEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setChallengeModalData } from "@/redux/slices"
import { ListNumbersIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import React from "react"

export interface ChallengeCardProps {
    challenge: ChallengeEntity
}

/**
 * One challenge row in the Learn “Challenges” tab; opens ChallengeModal.
 */
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
    const t = useTranslations()
    const { onOpen } = useChallengeDisclosure()
    const dispatch = useAppDispatch()
    const inputCount = challenge.inputs?.length ?? 0
    const thumb = challenge.thumbnailUrl?.trim()

    return (
        <StarCiCard
            isPressable
            className="transition-background hover:bg-content2/40"
            onPress={() => {
                dispatch(setChallengeModalData({ data: challenge }))
                onOpen()
            }}
        >
            <StarCiCardBody>
                <div className="grid grid-cols-3 gap-4">
                    {thumb ? (
                        <StarCiImage
                            src={thumb}
                            alt={challenge.title}
                            className="aspect-video h-full rounded-md object-cover"
                        />
                    ) : (
                        <div
                            className="flex aspect-video h-full items-center justify-center rounded-md bg-warning-100 dark:bg-warning-500/20"
                            aria-hidden
                        >
                            <TrophyIcon className="size-12 text-warning-600 dark:text-warning-400" />
                        </div>
                    )}
                    <div className="col-span-2 flex flex-col gap-3 text-start">
                        <div className="line-clamp-1 font-medium">{challenge.title}</div>
                        <div className="line-clamp-3 text-justify text-sm italic text-foreground-500">
                            {challenge.brief}
                        </div>
                        <StarCiChip
                            startContent={<ListNumbersIcon className="size-5" />}
                            color="warning"
                            size="sm"
                            variant="flat"
                        >
                            {t("course.modules.challengeInputsCount", {
                                count: inputCount,
                            })}
                        </StarCiChip>
                    </div>
                </div>
            </StarCiCardBody>
        </StarCiCard>
    )
}
