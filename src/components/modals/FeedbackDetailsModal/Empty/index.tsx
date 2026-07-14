"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link FeedbackDetailsEmpty}.
 */
export type FeedbackDetailsEmptyProps = WithClassNames<undefined>

/**
 * Empty state for feedback details list — no grader notes on this attempt.
 *
 * @param props - Optional styling props.
 */
export const FeedbackDetailsEmpty = (props: FeedbackDetailsEmptyProps) => {
    const { className } = props
    const t = useTranslations()
    return (
        <EmptyState
            icon={<CheckCircleIcon />}
            title={t("feedback.empty")}
            className={cn("rounded-medium border border-default", className)}
        />
    )
}

