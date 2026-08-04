"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { VerdictIcon, _ModelByline } from "./component"

export { VerdictIcon }

/** Props the connected {@link ModelByline} takes from its caller. */
export interface ModelBylineConnectedProps {
    /** The served model id. `null` → renders nothing (model not recorded). */
    model: string | null
    /** The model's resolved tier category. */
    category?: AiModelCategory
    /** Whether to prefix with the "graded by" label (the result card does; the drawer rows don't). */
    withLabel?: boolean
}

/**
 * Grading-model attribution — the CONNECTED half: resolves the "graded by "
 * prefix via `t()` when {@link ModelBylineConnectedProps.withLabel} is set.
 * See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link ModelBylineConnectedProps}
 */
export const ModelByline = ({ model, category, withLabel = false }: ModelBylineConnectedProps) => {
    const t = useTranslations()
    return (
        <_ModelByline
            model={model}
            category={category}
            gradedByPrefix={withLabel ? `${t("submissionResult.gradedBy")} ` : undefined}
        />
    )
}

/** Folder-matching handle for the grading-byline block — an alias of {@link ModelByline}. */
export const GradingByline = ModelByline
