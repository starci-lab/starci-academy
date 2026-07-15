import React from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { EnumChip } from "../EnumChip"
import type { EnumChipEntry } from "../EnumChip"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link AiCategoryChip}. */
export interface AiCategoryChipProps extends WithClassNames<undefined> {
    /** Cost/quality category that drives the chip color + localized label. */
    category: AiModelCategory
}

/**
 * Presentational badge for an AI model's cost/quality category — the single source
 * for the model-category badge across the grade picker and the AI lab. A thin domain
 * map over the shared {@link EnumChip} primitive: free → neutral, economy → green,
 * balanced → yellow, premium + frontier → red (both are the top, highest-cost tiers).
 * This map is the color source of truth for the category tier scale.
 *
 * @param props - {@link AiCategoryChipProps}
 */
export const AiCategoryChip = ({ category, className }: AiCategoryChipProps) => {
    const t = useTranslations()
    const map: Record<AiModelCategory, EnumChipEntry> = {
        [AiModelCategory.Free]: { color: "default", label: t(`aiSettings.categories.${AiModelCategory.Free}`) },
        [AiModelCategory.Economy]: { color: "success", label: t(`aiSettings.categories.${AiModelCategory.Economy}`) },
        [AiModelCategory.Balanced]: { color: "warning", label: t(`aiSettings.categories.${AiModelCategory.Balanced}`) },
        [AiModelCategory.Premium]: { color: "danger", label: t(`aiSettings.categories.${AiModelCategory.Premium}`) },
        [AiModelCategory.Frontier]: { color: "danger", label: t(`aiSettings.categories.${AiModelCategory.Frontier}`) },
    }
    return <EnumChip value={category} map={map} className={cn("w-fit", className)} />
}
