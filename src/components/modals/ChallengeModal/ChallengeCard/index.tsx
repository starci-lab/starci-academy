import React from "react"
import { Spacer } from "@heroui/react"
import { StarCiButton } from "@/components/atomic"
import {
    useChallengeSubmissionDisclosure,
} from "@/hooks/singleton"
import { SwordIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"

export const ChallengeCard = () => {
    const { onOpen } = useChallengeSubmissionDisclosure()
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
        <div className="bg-secondary/10 rounded-medium p-4">
            <div>
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
                <StarCiButton
                    color="default"
                    variant="flat"
                    startContent={<SwordIcon className="size-5" />}
                    onPress={onOpen}
                >
                    {t("challenge.battle.cta")}
                </StarCiButton>
            </div>
        </div>
    )
}
