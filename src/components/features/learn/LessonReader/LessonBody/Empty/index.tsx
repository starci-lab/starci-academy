"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { WithClassNames } from "@/modules/types/base/class-name"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

export type LessonBodyEmptyProps = WithClassNames<undefined>

/**
 * Empty state for lesson tab.
 * @param {LessonBodyEmptyProps} props Empty props (unused).
 */
export const LessonBodyEmpty = ({ className }: LessonBodyEmptyProps) => {
    const t = useTranslations()
    return (
        <SimpleEmptyState className={className}>
            {t("content.lessonVideosEmpty")}
        </SimpleEmptyState>
    )
}
