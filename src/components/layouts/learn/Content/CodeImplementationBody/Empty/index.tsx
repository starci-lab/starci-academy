"use client"

import React from "react"
import { useTranslations } from "next-intl"

export interface CodeImplementationEmptyProps {
    /** Optional wrapper class. */
    className?: string
}

/**
 * Empty state when the lesson has no implementation guides.
 */
export const CodeImplementationEmpty = ({ className }: CodeImplementationEmptyProps) => {
    const t = useTranslations()

    return (
        <p className={className ?? "text-sm text-muted"}>
            {t("content.codeImplementation.empty")}
        </p>
    )
}
