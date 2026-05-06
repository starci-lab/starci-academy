"use client"

import React from "react"
import { Surface } from "@heroui/react"
import { MarkdownContent } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import type { ChallengeRequirementEntity } from "@/modules/types"

interface ChallengeRequirementsProps {
    /** Ordered requirement rows of the challenge. */
    challengeRequirements: Array<ChallengeRequirementEntity>
}

/**
 * Render the requirements block in challenge modal.
 *
 * @param props Requirement rows for current challenge.
 */
export const ChallengeRequirements = (props: ChallengeRequirementsProps) => {
    const { challengeRequirements } = props
    const t = useTranslations()

    return (
        <>
            <div className="text-base font-semibold text-foreground">{t("challenge.requirements")}</div>
            <div className="h-2" />
            <div className="flex flex-col gap-2">
                {
                    challengeRequirements.length
                        ? challengeRequirements.map((requirement) => (
                            <Surface key={requirement.id} className="rounded-2xl bg-background px-3 py-2">
                                <MarkdownContent markdown={requirement.purpose || t("challenge.empty")} />
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
