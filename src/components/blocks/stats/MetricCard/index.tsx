import React from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"
import { SectionCard } from "@/components/blocks/cards/SectionCard"

/**
 * Props for the {@link MetricCard} block.
 *
 * A standalone metric card that presents a single data point — a large value, a
 * descriptive label, and an optional hint note. Tier-3 presentational — all
 * content arrives via props; no store, no fetch.
 */
export interface MetricCardProps {
    /**
     * The primary metric value to highlight (e.g. "1,204", "98%", a ReactNode
     * counter). Rendered large and emphasized.
     */
    value: React.ReactNode
    /**
     * Short description of what the value measures (e.g. "Total Enrollments",
     * "Completion Rate"). The PROMINENT line: rendered `sm` in the default
     * foreground tone, right below the value.
     */
    label: React.ReactNode
    /**
     * Optional supplementary note below the label. The QUIET footnote: rendered
     * SMALL and MUTED (`xs`) — deliberately less prominent than the label so
     * the two lines never read as the same thing (teacher 2026-07-16).
     */
    hint?: React.ReactNode
    /**
     * Where this card sits inside its parent. Appearance is not passable — it
     * is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * MetricCard is a standalone, framed metric display block built on
 * {@link SectionCard}. It wraps a single data point — value, label, and an
 * optional hint — in a vertical stack. Unlike {@link StatPair}, which is
 * frameless and intended for stat ribbons, MetricCard supplies its own card
 * frame and is suitable for dashboards, profile sidebars, or KPI grids.
 *
 * The label is `sm` foreground (prominent); the hint is `xs` muted (a quiet
 * footnote), so the two lines are never confused for each other (no leading
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
    classNames,
}: MetricCardProps) => {
    return (
        // SectionCard provides the framed card shell (border + bg + radius)
        <SectionCard classNames={classNames}>
            <StackV
                gap={2}
                items={[
                    // Primary metric value — large and visually prominent
                    () => <Typography size="h4" weight="semibold" text={value} />,
                    // Descriptive label — sm foreground, the prominent line
                    () => <Typography size="sm" text={label} />,
                    // Optional hint — small + muted footnote, DISTINCT from the label
                    ...(hint ? [() => <Typography size="xs" color="muted" text={hint} />] : []),
                ]}
            />
        </SectionCard>
    )
}
