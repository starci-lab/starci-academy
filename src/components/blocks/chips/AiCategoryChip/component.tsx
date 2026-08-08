import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

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

/** Props for {@link _AiCategoryChip} — presentational; label already resolved. */
export interface AiCategoryChipProps {
    /** Cost/quality category that drives the dot color. */
    category: AiModelCategory
    /** Already-localized category name. */
    label: string
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
export const _AiCategoryChip = ({ category, label }: AiCategoryChipProps) => (
    <StackH
        as="span"
        inline
        identity={{ tier: "block", component: "AiCategoryChip" }}
        principle="icon-text"
        explain="Tier colour dot rides with its category word — not name-handle, because this is a glyph+label joint not a person name stacked over a handle."
        items={[
            () => (
                <span
                    aria-hidden
                    className={`size-3 shrink-0 rounded-full ${AI_CATEGORY_COLOR[category]}`}
                />
            ),
            () => <Typography size="xs" color="muted" text={label} />,
        ]}
    />
)
