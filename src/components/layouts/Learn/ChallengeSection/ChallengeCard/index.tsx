"use client"
import { Cup as TrophyIcon, Flag as SwordIcon, ListOl as ListNumbersIcon } from "@gravity-ui/icons"
import { Button, Chip } from "@heroui/react"
import { useChallengeOverlayState } from "@/hooks"
import { ChallengeDifficulty, ChallengeEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setChallengeId } from "@/redux/slices"
import { TagChips } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import React, { useCallback, useMemo } from "react"
import { difficultyPalette } from "@/components/pallettes"
import { CHALLENGE_DEMO_TAGS } from "./constants"


export interface ChallengeCardProps {
    /** One module challenge block from API. */
    challenge: ChallengeEntity
}

/**
 * Single challenge row in the Learn “Challenges” tab; opens full detail in ChallengeModal.
 */
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
    const t = useTranslations()
    const { open } = useChallengeOverlayState()
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
    }, [challenge.difficulty])

    /** Select this challenge and open its detail modal. */
    const onPress = useCallback(() => {
        dispatch(setChallengeId(challenge.id))
        open()
    }, [dispatch, challenge.id, open])

    return (
        <Button
            className="w-full h-fit p-3 card card--default cursor-pointer flex flex-col items-start text-left"
            variant="tertiary"
            onPress={onPress}
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="font-semibold text-lg overflow-hidden whitespace-normal">
                    {challenge.orderIndex + 1}
                    {". "}
                    {challenge.title}{" "}
                    <span>(20/40)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                    >
                        <TrophyIcon className="size-4" />
                        <Chip.Label>
                            {t("challenge.score", {
                                score: challenge.score,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        color="accent"
                        size="sm"
                    >
                        <ListNumbersIcon className="size-4" />
                        <Chip.Label>
                            {t("challenge.steps.count", {
                                count: challenge.steps?.length ?? 0,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                        className={difficultyPalette[challenge.difficulty].text}
                    >
                        <SwordIcon className="size-4" />
                        <Chip.Label>{t(difficultyName)}</Chip.Label>
                    </Chip>
                </div>
                <div className="line-clamp-3 text-justify text-sm italic text-muted overflow-hidden whitespace-normal">
                    {challenge.description}
                </div>
                <TagChips tags={CHALLENGE_DEMO_TAGS} variant="soft" />
            </div>
        </Button>
    )
}

