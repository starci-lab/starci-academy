"use client"

import { FaceRobot as RobotIcon } from "@gravity-ui/icons"
import React from "react"
import {
    useTranslations,
} from "next-intl"

/**
 * StarCI AI screen header — robot icon + title + subtitle.
 */
export const StarciAiHeader = () => {
    const t = useTranslations("starciAi")

    return (
        <div className="flex items-center gap-3">
            <RobotIcon
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
