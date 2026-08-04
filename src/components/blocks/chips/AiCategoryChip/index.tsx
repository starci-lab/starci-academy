import React from "react"
import { Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * The model-category → dot color scale — the SINGLE source of truth for the tier
 * ramp. A Tailwind palette ramp, not the semantic tokens: a capability tier is not a
 * status. The two embedding axes sit off the low/medium/high ramp. Change it here once.
 */
export const AI_CATEGORY_COLOR: Record<AiModelCategory, string> = {
    [AiModelCategory.Low]: "bg-slate-400",
    [AiModelCategory.Medium]: "bg-cyan-500",
    [AiModelCategory.High]: "bg-amber-500",
    [AiModelCategory.EmbeddingBulk]: "bg-violet-500",
    [AiModelCategory.EmbeddingDoc]: "bg-emerald-500",
}

/** Props for {@link AiCategoryChip}. */
export interface AiCategoryChipProps extends WithClassNames<undefined> {
    /** Cost/quality category that drives the dot color + localized label. */
    category: AiModelCategory
}

/**
 * GitHub-style badge for an AI model's cost/quality category — the single source for
 * the model-category badge across the grade picker and the AI lab. A small
 * tier-coloured dot followed by the localized category name, mirroring
 * {@link import("../LanguageChip").LanguageChip}'s shape. No pill/box; the dot
 * carries the colour. Colour comes from the shared {@link AI_CATEGORY_COLOR} scale.
 *
 * @param props - {@link AiCategoryChipProps}
 * @see Story: .storybook/stories/blocks/chips/AiCategoryChip/AiCategoryChip.stories
 */
export const AiCategoryChip = ({ category, className }: AiCategoryChipProps) => {
    const t = useTranslations()
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <span aria-hidden className={cn("size-3 shrink-0 rounded-full", AI_CATEGORY_COLOR[category])} />
            <Typography type="body-xs" color="muted">
                {t(`aiSettings.categories.${category}`)}
            </Typography>
        </span>
    )
}
