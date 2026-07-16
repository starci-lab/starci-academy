import React from "react"
import { cn, Typography } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SectionCard } from "@/components/blocks/cards/SectionCard"

/**
 * Props for the {@link MetricCard} block.
 *
 * A standalone metric card that presents a single data point — a large value, a
 * descriptive label, and an optional hint note. Tier-3 presentational — all
 * content arrives via props; no store, no fetch.
 */
export interface MetricCardProps extends WithClassNames<undefined> {
    /**
     * The primary metric value to highlight (e.g. "1,204", "98%", a ReactNode
     * counter). Rendered large and emphasized.
     */
    value: React.ReactNode
    /**
     * Short description of what the value measures (e.g. "Total Enrollments",
     * "Completion Rate"). The PROMINENT line: rendered `body-sm` in the default
     * foreground tone, right below the value.
     */
    label: React.ReactNode
    /**
     * Optional supplementary note below the label. The QUIET footnote: rendered
     * SMALL and MUTED (`body-xs`) — deliberately less prominent than the label so
     * the two lines never read as the same thing (thầy 2026-07-16).
     */
    hint?: React.ReactNode
}

/**
 * MetricCard is a standalone, framed metric display block built on
 * {@link SectionCard}. It wraps a single data point — value, label, and an
 * optional hint — in a vertical flex layout. Unlike {@link StatPair}, which is
 * frameless and intended for stat ribbons, MetricCard supplies its own card
 * frame and is suitable for dashboards, profile sidebars, or KPI grids.
 *
 * The label is `body-sm` foreground (prominent); the hint is `body-xs` muted (a
 * quiet footnote), so the two lines are never confused for each other (no leading
 * icon — removed 2026-07-16).
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 *
 * @param props - {@link MetricCardProps}
 *
 * @example
 * <MetricCard
 *   value="1,204"
 *   label="Total Enrollments"
 *   hint="Updated daily"
 * />
 * @see Story: .storybook/stories/blocks/stats/MetricCard/MetricCard.stories
 */
export const MetricCard = ({
    value,
    label,
    hint,
    className,
}: MetricCardProps) => {
    return (
        // SectionCard provides the framed card shell (border + bg + radius)
        <SectionCard className={cn(className)}>
            <div className="flex flex-col gap-2">
                {/* Primary metric value — large and visually prominent */}
                <Typography type="h4" weight="semibold">
                    {value}
                </Typography>

                {/* Descriptive label — body-sm foreground, the prominent line */}
                <Typography type="body-sm">
                    {label}
                </Typography>

                {/* Optional hint — small + muted footnote, DISTINCT from the label */}
                {hint ? (
                    <Typography type="body-xs" color="muted">
                        {hint}
                    </Typography>
                ) : null}
            </div>
        </SectionCard>
    )
}
