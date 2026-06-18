"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"

export type ChallengeBodyEmptyProps = WithClassNames<undefined>

/**
 * Empty state for challenge tab.
 * @param {ChallengeBodyEmptyProps} props Empty props (unused).
 */
export const ChallengeBodyEmpty = ({ className }: ChallengeBodyEmptyProps) => {
    const t = useTranslations()
    return (
        <div className={cn("text-sm text-muted", className)}>
            {t("challenge.empty")}
        </div>
    )
}
