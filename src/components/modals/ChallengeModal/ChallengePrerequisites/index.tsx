"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { ChallengePrerequisiteEntity } from "@/modules/types"
import { MarkdownContent } from "@/components/reuseable"

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
            <div className="h-0.5" />
            <div className="flex flex-col pl-3 gap-0.5">
                {
                    challengePrerequisites.length
                        ? challengePrerequisites.map((prerequisite) => (
                            <div key={prerequisite.id}>
                                <MarkdownContent markdown={prerequisite.text || t("challenge.empty")} />
                            </div>
                        ))
                        : (
                            <div className="text-sm text-muted">{t("challenge.empty")}</div>
                        )
                }
            </div>
        </>
    )
}
