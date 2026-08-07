"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

/** Props for the code-explaining empty state. */
export type CodeExplainingEmptyProps = Record<string, never>
/**
 * Empty state when the lesson has no code explaining rows.
 */
export const Empty = () => {
    const t = useTranslations()

    return (
        <SimpleEmptyState>
            {t("content.codeExplainings.empty")}
        </SimpleEmptyState>
    )
}
