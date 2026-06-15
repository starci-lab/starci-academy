"use client"

import { FaceRobot as RobotIcon } from "@gravity-ui/icons"
import React from "react"
import {
    useTranslations,
} from "next-intl"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link StarciAiHeader}. */
export interface StarciAiHeaderProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props. */
    readonly _reserved?: undefined
}

/**
 * StarCI AI screen header — robot icon + title + subtitle.
 */
export const StarciAiHeader = ({ className }: StarciAiHeaderProps) => {
    const t = useTranslations("starciAi")

    return (
        <div className={cn("flex items-center gap-3", className)}>
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
