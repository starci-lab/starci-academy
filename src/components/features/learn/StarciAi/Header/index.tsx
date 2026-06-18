"use client"

import { RobotIcon } from "@phosphor-icons/react"
import React from "react"
import {
    useTranslations,
} from "next-intl"
import { Typography, cn } from "@heroui/react"
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
                aria-hidden
                focusable="false"
                className="size-8 text-accent"
            />
            <div className="flex flex-col">
                <Typography type="h3" weight="bold">
                    {t("title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("subtitle")}
                </Typography>
            </div>
        </div>
    )
}
