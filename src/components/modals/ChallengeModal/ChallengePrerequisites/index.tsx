"use client"

import React from "react"
import { Surface } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import type { ChallengePrerequisiteEntity } from "@/modules/types"

interface ChallengePrerequisitesProps {
    /** Ordered prerequisite rows of the challenge. */
    challengePrerequisites: Array<ChallengePrerequisiteEntity>
}

/**
 * Render the prerequisites block in challenge modal.
 *
 * @param props Prerequisite rows for current challenge.
 */
export const ChallengePrerequisites = (props: ChallengePrerequisitesProps) => {
    const { challengePrerequisites } = props
    const t = useTranslations()

    return (
        <>
            <div className="text-base font-semibold text-foreground">{t("challenge.prerequisites")}</div>
            <div className="h-2" />
            <div className="flex flex-col gap-2">
                {
                    challengePrerequisites.length
                        ? challengePrerequisites.map((prerequisite) => (
                            <Surface key={prerequisite.id} className="rounded-2xl bg-background px-3 py-2">
                                <MarkdownContent markdown={prerequisite.text || t("challenge.empty")} />
                            </Surface>
                        ))
                        : (
                            <div className="text-sm text-muted">{t("challenge.empty")}</div>
                        )
                }
            </div>
        </>
    )
}
