"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Spacer } from "@heroui/react"
import { TrophyIcon } from "@phosphor-icons/react"
import { ChallengeCard } from "./ChallengeCard"

/**
 * Learn tab “Challenges”: ordered module challenges (title, brief, input count).
 */
export const ChallengeSection = () => {
    const t = useTranslations()
    const challenges = useAppSelector((state) => state.course.module?.challenges)

    const rows = useMemo(() => {
        return [...(challenges ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [challenges])

    return (
        <div>
            <div className="text-sm text-foreground-500">
                {t("course.modules.challengesCount", { count: rows.length })}
            </div>
            <Spacer y={3} />
            {rows.length === 0 ? (
                <div className="rounded-medium border border-dashed border-divider bg-default/30 px-6 py-12 text-center">
                    <TrophyIcon
                        className="mx-auto mb-3 size-10 text-foreground-400"
                        aria-hidden
                    />
                    <div className="text-sm text-foreground-500">
                        {t("course.modules.challengesEmpty")}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {rows.map((item) => (
                        <ChallengeCard key={item.id} challenge={item} />
                    ))}
                </div>
            )}
        </div>
    )
}
