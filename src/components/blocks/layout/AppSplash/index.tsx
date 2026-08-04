"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _AppSplash } from "./component"

/**
 * AppSplash — the CONNECTED half: resolves the loading label via `t()`. See
 * `design/storybook/architecture/split.md`.
 */
export const AppSplash = () => {
    const t = useTranslations("common")
    return <_AppSplash loadingLabel={t("loading")} />
}
