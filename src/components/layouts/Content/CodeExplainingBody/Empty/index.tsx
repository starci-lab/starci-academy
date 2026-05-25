"use client"

import React from "react"
import { useTranslations } from "next-intl"

export interface CodeExplainingEmptyProps {
    /** Optional wrapper class. */
    className?: string
}

/**
 * Empty state when the lesson has no code explaining rows.
 */
export const CodeExplainingEmpty = ({ className }: CodeExplainingEmptyProps) => {
    const t = useTranslations()

    return (
        <p className={className ?? "text-sm text-muted"}>
            {t("content.codeExplainings.empty")}
        </p>
    )
}
