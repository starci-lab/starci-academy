import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import type { SkeletonTypographyType } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — TitledText: a primary line + optional muted
 * secondary (and optional hint) stacked vertically as ONE primitive. A
 * "title↔subtitle" pair is a semantic UNIT, so it is a single component (one
 * anatomy node), NOT two/three raw `<Typography>` hand-rolled at every row.
 *
 * This is the single most-recurring composite in the app (≥16 call-sites, ≥6
 * lanes: SettingToggleRow, ListRow, Stepper, PageHeader, EmptyState,
 * RewardItemCard, PersonaIdentityChip name/role, SummaryCard stat…). The
 * primitive OWNS the type scale per `size`; the caller passes nodes only.
 * NO `@/components` imports.
 */

/**
 * Vertical text-stack scale:
 * - `row`    — dense list/setting row (title `body-sm` medium · subtitle `body-xs` muted).
 * - `header` — section/page header (title `h3` semibold · subtitle `body-sm` muted).
 * - `stat`   — a metric (title = big `h3` bold VALUE · subtitle = foreground label · hint muted).
 */
export type TitledTextSize = "row" | "header" | "stat"

/** Typography type + tone config resolved per {@link TitledTextSize}. */
interface SizeConfig {
    titleType: "body-sm" | "h3"
    titleWeight: "medium" | "semibold" | "bold"
    subType: "body-xs" | "body-sm"
    /** `undefined` → foreground (default); `"muted"` → muted line. */
    subColor?: "muted"
    subWeight?: "medium"
    /** Skeleton mirror widths per line. */
    skeleton: { title: string; sub: string; hint: string }
}

const SIZE_CONFIG: Record<TitledTextSize, SizeConfig> = {
    row: {
        titleType: "body-sm",
        titleWeight: "medium",
        subType: "body-xs",
        subColor: "muted",
        skeleton: { title: "1/2", sub: "2/3", hint: "1/3" },
    },
    header: {
        titleType: "h3",
        titleWeight: "semibold",
        subType: "body-sm",
        subColor: "muted",
        skeleton: { title: "1/3", sub: "2/3", hint: "1/2" },
    },
    stat: {
        titleType: "h3",
        titleWeight: "bold",
        // stat's secondary is the LABEL — foreground + medium, not muted.
        subType: "body-sm",
        subWeight: "medium",
        skeleton: { title: "1/3", sub: "2/3", hint: "1/2" },
    },
}

/** Props for the {@link TitledText} primitive. */
export interface TitledTextProps {
    /** Primary line (title / name / label / stat value). */
    title: ReactNode
    /** Optional secondary line beneath the title (subtitle / role / description / stat label). */
    subtitle?: ReactNode
    /** Optional third muted line (only meaningful for `size="stat"`, e.g. a delta hint). */
    hint?: ReactNode
    /** Text-stack scale. Defaults to `"row"`. */
    size?: TitledTextSize
    /** Override the title weight (per-size default otherwise). */
    weight?: "medium" | "semibold" | "bold"
    /** Truncate every line to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → render the skeleton mirror (bars sized per line). */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Extra classes on the root (e.g. `flex-1` for row layouts). */
    className?: string
}

/**
 * TitledText renders a primary line over an optional muted secondary (and hint)
 * as one vertical unit. The primitive OWNS the type scale + tone per `size`; the
 * caller passes nodes only. Root is `flex min-w-0 flex-col` so truncation works
 * and callers can add `flex-1`.
 *
 * @param props - {@link TitledTextProps}
 */
export const TitledText = ({
    title,
    subtitle,
    hint,
    size = "row",
    weight,
    truncate = false,
    isSkeleton = false,
    anatPart,
    className,
}: TitledTextProps) => {
    const cfg = SIZE_CONFIG[size]

    if (isSkeleton) {
        return (
            <div className={cn("flex min-w-0 flex-col gap-0", className)} data-anat-part={anatPart}>
                <Skeleton.Typography type={cfg.titleType as SkeletonTypographyType} width={cfg.skeleton.title} />
                {subtitle ? <Skeleton.Typography type={cfg.subType as SkeletonTypographyType} width={cfg.skeleton.sub} /> : null}
                {hint ? <Skeleton.Typography type="body-xs" width={cfg.skeleton.hint} /> : null}
            </div>
        )
    }

    return (
        <div className={cn("flex min-w-0 flex-col gap-0", className)} data-anat-part={anatPart}>
            <Typography type={cfg.titleType} weight={weight ?? cfg.titleWeight} truncate={truncate}>
                {title}
            </Typography>
            {subtitle ? (
                <Typography type={cfg.subType} color={cfg.subColor} weight={cfg.subWeight} truncate={truncate}>
                    {subtitle}
                </Typography>
            ) : null}
            {hint ? (
                <Typography type="body-xs" color="muted" truncate={truncate}>
                    {hint}
                </Typography>
            ) : null}
        </div>
    )
}
