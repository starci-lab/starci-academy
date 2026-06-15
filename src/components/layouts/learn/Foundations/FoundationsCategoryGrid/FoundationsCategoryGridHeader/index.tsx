"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"

/**
 * Title and description for the foundations category hub.
 *
 * Self-contained section (single-use). The topic count lives on the search row
 * (right-aligned) in the layout, mirroring the resource count on the category
 * learn page.
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
