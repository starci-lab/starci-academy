"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _AiCategoryChip, type AiCategoryChipProps } from "./component"

/** Props the connected {@link AiCategoryChip} takes from its caller. */
export type AiCategoryChipConnectedProps = Omit<AiCategoryChipProps, "label">

/**
 * GitHub-style badge for an AI model's cost/quality category — the CONNECTED
 * half: resolves the category label via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link AiCategoryChipConnectedProps}
 */
export const AiCategoryChip = ({ category, className }: AiCategoryChipConnectedProps) => {
    const t = useTranslations()
    return (
        <_AiCategoryChip
            category={category}
            className={className}
            label={t(`aiSettings.categories.${category}`)}
        />
    )
}
