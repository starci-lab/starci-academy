"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Spacer } from "@heroui/react"
import { TrophyIcon } from "@phosphor-icons/react"
import { ChallengeCard } from "./ChallengeCard"
import { StarCiSkeleton } from "@/components/atomic"
import { useQueryChallengesSwr } from "@/hooks/singleton"
import { ChallengeCardSkeleton } from "./ChallengeCardSkeleton"

/**
 * Learn tab “Challenges”: ordered module challenges (title, brief, input count).
 */
export const ChallengeSection = () => {
    const t = useTranslations()
    const challenges = useAppSelector((state) => state.challenge.entities)
    const { isLoading } = useQueryChallengesSwr()

    return (
        <div>
            {isLoading || !challenges ? (
                <StarCiSkeleton className="h-[14px] w-[150px] my-[3px]" />
            ) : (
                <div className="text-sm text-foreground-500">
                    {t("challenge.count", { count: challenges?.length ?? 0 })}
                </div>
            )}
            <Spacer y={6} />
            {isLoading || !challenges ? (
                <div className="flex flex-col gap-3 w-full">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <ChallengeCardSkeleton key={index} />
                    ))}
                </div>
            ) : challenges?.length === 0 ? (
                <div className="rounded-medium border border-dashed border-divider bg-default/30 px-6 py-12 text-center">
                    <TrophyIcon
                        className="mx-auto mb-3 size-10 text-foreground-400"
                        aria-hidden
                    />
                    <div className="text-sm text-foreground-500">
                        {t("challenge.empty")}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    {
                        challenges?.sort(
                            (prev, next) => prev.orderIndex - next.orderIndex
                        ).map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} />
                        )
                        )
                    }
                </div>
            )}
        </div>
    )
}
