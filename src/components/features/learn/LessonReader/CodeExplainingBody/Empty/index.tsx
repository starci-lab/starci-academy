"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SimpleEmptyState } from "@/components/blocks/feedback/SimpleEmptyState"

export type CodeExplainingEmptyProps = WithClassNames<undefined>

/**
 * Empty state when the lesson has no code explaining rows.
 */
export const CodeExplainingEmpty = ({ className }: CodeExplainingEmptyProps) => {
    const t = useTranslations()

    return (
        <SimpleEmptyState className={className}>
            {t("content.codeExplainings.empty")}
        </SimpleEmptyState>
    )
}
