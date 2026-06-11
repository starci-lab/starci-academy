"use client"

import { CircleCheck as CheckCircleIcon, Cup as TrophyIcon, Flame } from "@gravity-ui/icons"
import React, { useMemo } from "react"
import { Button, Card, CardContent, Chip } from "@heroui/react"
import { ChallengeDifficulty, type ChallengeEntity } from "@/modules/types"
import { useTranslations } from "next-intl"
import { difficultyPalette } from "../../../../pallettes"
import { useChallengeOverlayState } from "@/hooks"
import { setChallengeId } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"


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
    // Per-challenge progress, populated by `useQueryChallengeSubmissionProgressSwr`.
    const completionTasks = useAppSelector((state) => state.challenge.completionTasks)
    const challengeProgress = useMemo(
        () => completionTasks.find((completionTask) => completionTask.id === challenge.id) ?? null,
        [completionTasks, challenge.id],
    )
    // Map the challenge status to a chip (color + label); "notStarted" shows no chip.
    const progressChip = useMemo(() => {
        if (!challengeProgress || challengeProgress.status === "notStarted") {
            return null
        }
        const score = challengeProgress.lastScore
        const maxScore = challengeProgress.maxScore
        switch (challengeProgress.status) {
        case "completed":
            return { color: "success" as const, withIcon: true, label: t("challenge.progress.completed", { score, maxScore }) }
        case "failed":
            return { color: "danger" as const, withIcon: false, label: t("challenge.progress.failed", { score, maxScore }) }
        case "inProgress":
        default:
            return { color: "warning" as const, withIcon: false, label: t("challenge.progress.inProgress", { score, maxScore }) }
        }
    }, [challengeProgress, t])
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
                            <Flame className="size-4" />
                            <Chip.Label>{t(difficultyName)}</Chip.Label>
                        </Chip>
                        {progressChip ? (
                            <Chip variant="secondary" color={progressChip.color}>
                                {progressChip.withIcon ? <CheckCircleIcon className="size-4" /> : null}
                                <Chip.Label>{progressChip.label}</Chip.Label>
                            </Chip>
                        ) : null}
                    </div>
                    <div className="text-xs text-muted mt-3">{challenge.description}</div>
                    <div className="h-3"/>
                    <div className="flex gap-2">
                        <Button onPress={() => {
                            dispatch(setChallengeId(challenge.id))
                            challengeOverlayState.open()
                        }}>
                            <Flame className="size-5" />
                            {t("challenge.do")}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
