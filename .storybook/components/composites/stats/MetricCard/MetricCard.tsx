import React from "react"
import { Card, CardContent, cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

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
const SectionCard = ({
    children,
    className,
    anatPart,
}: {
    children: React.ReactNode
    className?: string
    anatPart?: string
}) => (
    <Card className={cn(className)} data-anat-part={anatPart}>
        <CardContent>
            <StackV gap="grouped" body={children} />
        </CardContent>
    </Card>
)

/**
 * A standalone metric card that presents a single data point — a large value, a
 * descriptive label, and an optional hint note. Tier-3 presentational — all
 * content arrives via props.
 */
interface MetricCardOwnProps {
    /**
     * Optional supplementary note below the label. The QUIET footnote: rendered
     * SMALL and MUTED (`body-xs`) — deliberately less prominent than the label.
     */
    hint?: React.ReactNode
    /** Extra classes on the root element. */
    className?: string
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

/**
 * Props for {@link MetricCard}. `value`/`label` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer card has no real metric to show yet.
 */
export type MetricCardProps = MetricCardOwnProps &
    (
        | { isSkeleton: true; value?: React.ReactNode; label?: React.ReactNode }
        | {
            isSkeleton?: false
            /** The primary metric value to highlight (e.g. "1,204", "98%"). Rendered large and emphasized. */
            value: React.ReactNode
            /**
             * Short description of what the value measures. The PROMINENT line: rendered
             * `body-sm` in the default foreground tone, right below the value.
             */
            label: React.ReactNode
        }
    )

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
    isSkeleton = false,
    className,
    anatPart,
    showAnatomy = false,
}: MetricCardProps) => {
    return (
        // SectionCard provides the framed card shell (border + bg + radius)
        <SectionCard className={cn(className)} anatPart={anatPart}>
            <StackV
                gap="related"
                body={
                    isSkeleton ? (
                        <>
                            <HeroSkeleton className="h-6 w-16 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                            <HeroSkeleton className="h-4 w-24 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                            <HeroSkeleton className="h-3 w-20 rounded" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                        </>
                    ) : (
                        <>
                            {/* Primary metric value — large and visually prominent */}
                            <Typography size="h4" showAnatomy={showAnatomy} anatPart={showAnatomy ? "Typography" : undefined} text={value} />

                            {/* Descriptive label — body-sm foreground, the prominent line */}
                            <Typography size="sm" showAnatomy={showAnatomy} anatPart={showAnatomy ? "Typography" : undefined} text={label} />

                            {/* Optional hint — small + muted footnote, DISTINCT from the label */}
                            {hint ? (
                                <Typography size="xs" color="muted" showAnatomy={showAnatomy} anatPart={showAnatomy ? "Typography" : undefined} text={hint} />
                            ) : null}
                        </>
                    )
                }
            />
        </SectionCard>
    )
}
