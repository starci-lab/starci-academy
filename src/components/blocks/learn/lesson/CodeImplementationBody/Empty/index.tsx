"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

/** Props for the code-implementation empty state. */
export type CodeImplementationEmptyProps = WithClassNames<undefined>

/**
 * Empty state when the lesson has no implementation guides.
 */
export const Empty = ({ className }: CodeImplementationEmptyProps) => {
    const t = useTranslations()

    return (
        <SimpleEmptyState className={className}>
            {t("content.codeImplementation.empty")}
        </SimpleEmptyState>
    )
}
