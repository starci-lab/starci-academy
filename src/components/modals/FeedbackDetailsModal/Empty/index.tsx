"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"

/**
 * Empty state for feedback details list — no grader notes on this attempt.
 */
export const FeedbackDetailsEmpty = () => {
    const t = useTranslations()
    return (
        <EmptyState
            icon={<CheckCircleIcon />}
            title={t("feedback.empty")}
            className="rounded-medium border border-default"
        />
    )
}

