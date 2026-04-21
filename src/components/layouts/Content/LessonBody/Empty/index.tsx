"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"

export type LessonBodyEmptyProps = WithClassNames<undefined>

/**
 * Empty state for lesson tab.
 * @param {LessonBodyEmptyProps} props Empty props (unused).
 */
export const LessonBodyEmpty = ({ className }: LessonBodyEmptyProps) => {
    const t = useTranslations()
    return (
        <div className={cn("text-sm text-muted", className)}>
            {t("content.lessonVideosEmpty")}
        </div>
    )
}
