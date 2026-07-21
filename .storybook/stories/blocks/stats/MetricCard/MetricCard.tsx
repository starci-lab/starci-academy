import React from "react"
import { Card, CardContent, cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/MetricCard`. Authored in Storybook (not `src`);
 * synced to `src` later.
 */

/**
 * Inlined faithful local copy of `@/components/blocks/cards/SectionCard` (the
 * header-less path MetricCard uses): HeroUI `Card`/`CardContent` — globals already
 * give it the 3xl radius, `p-3`, no-shadow + border.
 * TODO: swap for the SectionCard local when the cards category ports it.
 */
const SectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <Card className={cn(className)}>
        <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
)

/**
 * A standalone metric card that presents a single data point — a large value, a
 * descriptive label, and an optional hint note. Tier-3 presentational — all
 * content arrives via props.
 */
export interface MetricCardProps {
    /** The primary metric value to highlight (e.g. "1,204", "98%"). Rendered large and emphasized. */
    value: React.ReactNode
    /**
     * Short description of what the value measures. The PROMINENT line: rendered
     * `body-sm` in the default foreground tone, right below the value.
     */
    label: React.ReactNode
    /**
     * Optional supplementary note below the label. The QUIET footnote: rendered
     * SMALL and MUTED (`body-xs`) — deliberately less prominent than the label.
     */
    hint?: React.ReactNode
    /** Extra classes on the root element. */
    className?: string
}

/**
 * MetricCard is a standalone, framed metric display block built on
 * {@link SectionCard}. It wraps a single data point — value, label, and an
 * optional hint — in a vertical flex layout. Unlike {@link StatPair} (frameless),
 * MetricCard supplies its own card frame.
 *
 * @param props - {@link MetricCardProps}
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
