"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"

/**
 * Empty state shown when a foundation cannot be resolved from the loaded list.
 *
 * Presentational: renders the localized not-found message, no logic.
 */
export const FoundationDetailNotFound = () => {
    const t = useTranslations()

    return (
        <div className="p-3">
            <p className="text-muted text-sm">{t("foundations.notFound")}</p>
        </div>
    )
}
