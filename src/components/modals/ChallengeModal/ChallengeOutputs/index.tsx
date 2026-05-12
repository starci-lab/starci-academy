"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { ChallengeOutputEntity } from "@/modules/types"

interface ChallengeOutputsProps {
    /** Ordered expected output rows of the challenge. */
    challengeOutputs: Array<ChallengeOutputEntity>
}

/**
 * Render the expected outputs block in challenge modal.
 *
 * @param props Output rows for current challenge.
 */
export const ChallengeOutputs = (props: ChallengeOutputsProps) => {
    const { challengeOutputs } = props
    const t = useTranslations()

    return (
        <>
            <div className="text-base font-semibold text-foreground">{t("challenge.outputs")}</div>
            <div className="h-2" />
            <ul className="list-disc list-inside pl-3 flex flex-col gap-2">
                {
                    challengeOutputs.length
                        ? challengeOutputs.map((output) => (
                            <li key={output.id}>
                                {output.text}
                            </li>
                        ))
                        : (
                            <div className="text-sm text-muted">{t("challenge.empty")}</div>
                        )
                }
            </ul>
        </>
    )
}
