"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    DarkLightModeSwitch,
} from "../DarkLightMode"

/**
 * Appearance row: label plus the dark/light mode switch.
 *
 * Presentational: composes the existing {@link DarkLightModeSwitch}. No props,
 * no business logic (theme state lives inside the switch).
 */
export const AppearanceRow = () => {
    const t = useTranslations()
    return (
        <div className="flex items-center justify-between gap-3 py-3 px-4">
            <div className="text-sm">{t("nav.appearance")}</div>
            <DarkLightModeSwitch />
        </div>
    )
}
