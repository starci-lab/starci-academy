"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

/** Props for the lesson-body empty state. */
export type LessonBodyEmptyProps = Record<string, never>
/**
 * Empty state for lesson tab.
 * @param {LessonBodyEmptyProps} props Empty props (unused).
 */
export const Empty = () => {
    const t = useTranslations()
    return (
        <SimpleEmptyState>
            {t("content.lessonVideosEmpty")}
        </SimpleEmptyState>
    )
}
