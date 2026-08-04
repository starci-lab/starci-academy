"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _AppearanceRow } from "./component"

/** Props for {@link AppearanceRow}. */
export type AppearanceRowProps = WithClassNames<undefined>

/**
 * Appearance row — the CONNECTED half: resolves the row label via `t()`. See
 * `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const AppearanceRow = ({ className }: AppearanceRowProps) => {
    const t = useTranslations()
    return <_AppearanceRow label={t("nav.appearance")} className={className} />
}
