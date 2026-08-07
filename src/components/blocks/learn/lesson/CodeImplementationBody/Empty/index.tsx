"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

/** Props for the code-implementation empty state. */
export type CodeImplementationEmptyProps = Record<string, never>
/**
 * Empty state when the lesson has no implementation guides.
 */
export const Empty = () => {
    const t = useTranslations()

    return (
        <SimpleEmptyState>
            {t("content.codeImplementation.empty")}
        </SimpleEmptyState>
    )
}
