"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { EmptyContent } from "@/components/blocks/async/EmptyContent"

/**
 * Props for the submission attempts empty state.
 */
export type EmptyProps = WithClassNames<undefined>

/**
 * Empty state when the submission attempts list has no rows.
 *
 * @param props - Optional `className` / `classNames` for layout.
 */
export const Empty = (props: EmptyProps) => {
    const { className } = props
    const t = useTranslations()
    return (
        <EmptyContent
            title={t("submissionAttempts.noAttempts")}
            className={className}
        />
    )
}
