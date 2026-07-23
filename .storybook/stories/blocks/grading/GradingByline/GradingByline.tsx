import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, SparkleIcon, XCircleIcon } from "@phosphor-icons/react"
import { AiCategoryChip, AiModelCategory } from "../../chips/AiCategoryChip/AiCategoryChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/grading/GradingByline`. Authored in Storybook (not `src`);
 * synced to `src` later. NO `@/components` imports — the tier chip is the LOCAL
 * `AiCategoryChip` primitive (imported relatively). In `src` the "graded by" copy
 * comes from `useTranslations()`; the string is INLINED here so the local port
 * stays self-contained.
 */

/**
 * Pass/fail verdict glyph (green check / red x). Shared by the result selector
 * chips, the drawer trigger, the verdict chip, and the history rows.
 *
 * @param props - whether the attempt passed + an optional className override.
 */
export const VerdictIcon = ({ pass, className, showAnatomy }: { pass: boolean, className?: string, showAnatomy?: boolean }) =>
    pass ? (
        <CheckCircleIcon aria-hidden focusable="false" className={cn("size-4 shrink-0 text-success-soft-foreground", className)} data-anat-part={showAnatomy ? "VerdictIcon" : undefined} />
    ) : (
        <XCircleIcon aria-hidden focusable="false" className={cn("size-4 shrink-0 text-danger-soft-foreground", className)} data-anat-part={showAnatomy ? "VerdictIcon" : undefined} />
    )

/**
 * Grading-model attribution: an accent sparkle + plain "graded by `<model>`" text,
 * followed by the model's tier chip. The model name is PLAIN TEXT (not a chip, not
 * mono) so it never sits chip-beside-chip with the tier chip — the rule is "text,
 * then a chip beside it". Renders nothing when the served model wasn't recorded.
 *
 * @param props - the served model id, its resolved tier category, and whether to
 *   prefix with the "graded by" label (the result card does; the drawer rows don't).
 */
export const ModelByline = ({
    model,
    category,
    withLabel = false,
    showAnatomy = false,
}: {
    model: string | null
    category?: AiModelCategory
    withLabel?: boolean
    showAnatomy?: boolean
}) => {
    if (!model) {
        return null
    }
    return (
        <>
            <span className="flex items-center gap-2 text-sm text-muted" data-anat-part={showAnatomy ? "span · dòng attribution" : undefined}>
                <SparkleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-accent-soft-foreground" data-anat-part={showAnatomy ? "SparkleIcon" : undefined} />
                <span>
                    {withLabel ? "Đã chấm bởi " : null}
                    <span className="text-foreground" data-anat-part={showAnatomy ? "Model text" : undefined}>{model}</span>
                </span>
            </span>
            {category ? <AiCategoryChip category={category} /> : null}
        </>
    )
}
