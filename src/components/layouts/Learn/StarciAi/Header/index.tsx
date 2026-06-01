"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    RobotIcon,
} from "@phosphor-icons/react"

/**
 * StarCI AI screen header — robot icon + title + subtitle.
 */
export const StarciAiHeader = () => {
    const t = useTranslations("starciAi")

    return (
        <div className="flex items-center gap-3">
            <RobotIcon
                weight="duotone"
                className="size-8 text-accent"
            />
            <div>
                <div className="text-2xl font-bold">
                    {t("title")}
                </div>
                <div className="text-sm text-muted">
                    {t("subtitle")}
                </div>
            </div>
        </div>
    )
}
