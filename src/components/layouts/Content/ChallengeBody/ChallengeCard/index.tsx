"use client"

import React, { useMemo } from "react"
import { Button, Card, CardContent, Chip } from "@heroui/react"
import { ChallengeDifficulty, type ChallengeEntity } from "@/modules/types"
import { SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { difficultyPalette } from "../../../../pallettes"
import { useChallengeOverlayState } from "@/hooks"
import { setChallengeId } from "@/redux/slices"
import { useAppDispatch } from "@/redux"

export interface ChallengeCardProps {
    /** Challenge row displayed in content tab. */
    challenge: ChallengeEntity
}

/**
 * Render one challenge card item.
 * @param {ChallengeCardProps} props Challenge card props.
 */
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
    const t = useTranslations()
    const difficultyName = useMemo(() => {
        switch (challenge.difficulty) {
        case ChallengeDifficulty.Easy:
            return "challenge.difficulty.easy"
        case ChallengeDifficulty.Medium:
            return "challenge.difficulty.medium"
        case ChallengeDifficulty.Hard:
            return "challenge.difficulty.hard"
        default:
            return "challenge.difficulty.easy"
        }
    }, [challenge.difficulty])
    const challengeOverlayState = useChallengeOverlayState()
    const dispatch = useAppDispatch()
    return (
        <Card>
            <CardContent>
                <div>
                    <div className="font-medium mb-2">{challenge.orderIndex + 1}. {challenge.title}</div>
                    <div className="flex items-center gap-2">
                        <Chip variant="secondary" color="accent">
                            <TrophyIcon className="size-4" />
                            <Chip.Label>{challenge.score}</Chip.Label>
                        </Chip>
                        <Chip color="default" className={difficultyPalette[challenge.difficulty].text}>
                            <SwordIcon className="size-4" />
                            <Chip.Label>{t(difficultyName)}</Chip.Label>
                        </Chip>
                    </div>
                    <div className="text-xs text-muted mt-3">{challenge.description}</div>
                    <div className="h-3"/>
                    <div className="flex gap-2">
                        <Button onPress={() => {
                            dispatch(setChallengeId(challenge.id))
                            challengeOverlayState.open()
                        }}>
                            <SwordIcon className="size-5" />
                            {t("challenge.do")}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
