import React from "react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { AiCategoryChip } from "@/components/blocks/chips/AiCategoryChip"
import type { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"

/** Props for {@link VerdictIcon}. */
export interface VerdictIconProps {
    /** `true` → green check; `false` → red x. */
    pass: boolean
}

/**
 * Pass/fail verdict glyph (green check / red x). Shared by the result selector
 * chips, the drawer trigger, the verdict chip, and the history rows.
 *
 * @param props - {@link VerdictIconProps}
 */
export const VerdictIcon = ({ pass }: VerdictIconProps) =>
    pass ? (
        <CheckCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-success-soft-foreground" />
    ) : (
        <XCircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-danger-soft-foreground" />
    )

/** Props for {@link _ModelByline} — presentational; the "graded by" prefix already resolved. */
export interface ModelBylineProps {
    /** The served model id. `null` → renders nothing (model not recorded). */
    model: string | null
    /** The model's resolved tier category. */
    category?: AiModelCategory
    /** Already-localized "graded by " prefix (with trailing space); omit to render the model name bare. */
    gradedByPrefix?: string
}

/**
 * Grading-model attribution: an accent sparkle + plain "graded by `<model>`" text,
 * followed by the model's tier chip. The model name is PLAIN TEXT (not a chip, not
 * mono) so it never sits chip-beside-chip with the tier chip — the rule is "text,
 * then a chip beside it". Renders nothing when the served model wasn't recorded.
 *
 * @param props - {@link ModelBylineProps}
 */
export const _ModelByline = ({ model, category, gradedByPrefix }: ModelBylineProps) => {
    if (!model) {
        return null
    }
    return (
        <>
            <span className="flex items-center gap-2 text-sm text-muted">
                <SparkleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-accent-soft-foreground" />
                <span>
                    {gradedByPrefix ?? null}
                    <span className="text-foreground">{model}</span>
                </span>
            </span>
            {category ? <AiCategoryChip category={category} /> : null}
        </>
    )
}
