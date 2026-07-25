import React from "react"
import { DotChip } from "../DotChip/DotChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `AiCategoryChip`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 * In `src` the enum lives in `@/modules/api/graphql/queries/query-ai-models`
 * and labels come from `useTranslations()`; both are INLINED here so the
 * local port stays self-contained.
 */

/** Cost/quality tier of an AI model (mirrors the backend `AiModelCategory`). */
export enum AiModelCategory {
    Free = "free",
    Economy = "economy",
    Balanced = "balanced",
    Premium = "premium",
    Frontier = "frontier",
}

/**
 * The model-category → dot color scale — the SINGLE source of truth for the category
 * tier ramp. A Tailwind palette ramp, not the 5 semantic tokens: cost/quality tier is
 * NOT a status, and 5 hạng would otherwise collide onto `danger` twice (premium ==
 * frontier). Change the ramp here once.
 */
export const AI_CATEGORY_COLOR: Record<AiModelCategory, string> = {
    [AiModelCategory.Free]: "bg-slate-400",
    [AiModelCategory.Economy]: "bg-emerald-500",
    [AiModelCategory.Balanced]: "bg-cyan-500",
    [AiModelCategory.Premium]: "bg-violet-500",
    [AiModelCategory.Frontier]: "bg-amber-500",
}

/** Localized category labels (in `src`: `t(\`aiSettings.categories.${category}\`)`). */
const AI_CATEGORY_LABEL: Record<AiModelCategory, string> = {
    [AiModelCategory.Free]: "Miễn phí",
    [AiModelCategory.Economy]: "Tiết kiệm",
    [AiModelCategory.Balanced]: "Cân bằng",
    [AiModelCategory.Premium]: "Cao cấp",
    [AiModelCategory.Frontier]: "Đỉnh",
}

/** Props for {@link AiCategoryChip}. */
export interface AiCategoryChipProps {
    /** Cost/quality category that drives the dot color + localized label. */
    category: AiModelCategory
    /** Extra classes on the wrapper. */
    className?: string
    /** Renders a skeleton mirror (dot + label bar) in place of the real chip. */
    isSkeleton?: boolean
    /** BlockAnatomy marker name for the root — set by the caller to expose this part. */
    anatPart?: string
}

/**
 * GitHub-style badge for an AI model's cost/quality category — the single source for
 * the model-category badge across the grade picker and the AI lab. A small
 * tier-coloured dot followed by the localized category name. A thin map wrapper over
 * the shared {@link DotChip} primitive; colour comes from the shared
 * {@link AI_CATEGORY_COLOR} scale.
 *
 * @param props - {@link AiCategoryChipProps}
 */
export const AiCategoryChip = ({ category, className, isSkeleton, anatPart }: AiCategoryChipProps) => {
    return (
        <DotChip
            dotClassName={AI_CATEGORY_COLOR[category]}
            label={AI_CATEGORY_LABEL[category]}
            className={className}
            isSkeleton={isSkeleton}
            anatPart={anatPart}
        />
    )
}
