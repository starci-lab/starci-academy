"use client"

import React from "react"
import { Button } from "@heroui/react"
import { Spacer } from "@/components/reuseable"
import { useChallengeOverlayState } from "@/hooks/singleton"
import { SwordIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { TrophyIcon } from "@phosphor-icons/react"

export const ChallengeCard = () => {
    const { open } = useChallengeOverlayState()
    const challenge = useAppSelector((state) => state.challenge.entity)
    const submissions = useAppSelector(
        (state) => state.challenge.challengeSubmissions,
    )
    const t = useTranslations()
    const maxScore = challenge?.score ?? 0
    const earnedScore =
        submissions?.reduce(
            (acc, row) => acc + (row.userSubmission?.score ?? 0),
            0,
        ) ?? 0
    return (
        <div className="relative overflow-hidden rounded-large bg-gradient-to-br from-secondary-500/20 to-secondary-100/20 p-3">
            <TrophyIcon
                weight="thin"
                className="pointer-events-none select-none absolute -right-16 -bottom-20 z-0 h-[240px] w-[240px] rotate-[-15deg] text-white/5 blur-[0.5px]"
            />
            <div className="relative z-10">
                <div className="text-sm">
                    {t("challenge.submissionModal.yourScoreLabel")}
                </div>
                <div className="text-2xl font-bold">
                    {t("challenge.submissionModal.scoreFraction", {
                        earned: earnedScore,
                        max: maxScore,
                    })}
                </div>
                <Spacer y={3} />
                <Button
                    onPress={open}
                    variant="tertiary"
                >
                    <span className="inline-flex items-center gap-2">
                        <SwordIcon className="size-5" />
                        {t("challenge.battle.cta")}
                    </span>
                </Button>
            </div>
        </div>
    )
}
