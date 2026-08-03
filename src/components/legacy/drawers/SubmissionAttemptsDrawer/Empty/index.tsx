"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"

/**
 * Empty state when the submission attempts list has no rows.
 */
export const Empty = () => {
    const t = useTranslations()
    return (
        <EmptyContent
            title={t("submissionAttempts.noAttempts")}
        />
    )
}
