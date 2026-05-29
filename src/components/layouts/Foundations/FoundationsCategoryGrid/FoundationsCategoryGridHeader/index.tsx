"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"

/**
 * Title and description block for the foundations category hub.
 *
 * Presentational: renders localized copy, no logic.
 */
export const FoundationsCategoryGridHeader = () => {
    const t = useTranslations()

    return (
        <div>
            <h1 className="text-2xl font-bold">{t("foundations.title")}</h1>
            <p className="text-muted mt-2 text-sm">{t("foundations.gridDescription")}</p>
        </div>
    )
}
