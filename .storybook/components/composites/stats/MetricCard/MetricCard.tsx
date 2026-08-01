import React from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

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
    classNames,
}: {
    children: React.ReactNode
    classNames?: Array<AllowedClassName>
}) => (
    <Card className={cn(classNames)} data-tier="composite" data-component="MetricCard">
        <CardContent>
            <StackV gap={4} body={children} />
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
     * `string`, not `ReactNode` — the composite wraps it in `Typography` itself,
     * so it must be able to build it.
     */
    hint?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    /**
     * When `true`, each composed part emits `` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
}

/**
 * Props for {@link MetricCard}. `value`/`label` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer card has no real metric to show yet.
 */
export type MetricCardProps = MetricCardOwnProps &
    (
        | { isSkeleton: true; value?: string; label?: string }
        | {
            isSkeleton?: false
            /**
             * The primary metric value to highlight (e.g. "1,204", "98%"). Rendered
             * large and emphasized. `string`, not `ReactNode` — the composite wraps
             * it in `Typography` itself, so it must be able to build it.
             */
            value: string
            /**
             * Short description of what the value measures. The PROMINENT line: rendered
             * `body-sm` in the default foreground tone, right below the value. `string` —
             * see {@link MetricCardProps.value}.
             */
            label: string
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
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "MetricCard" } as const

export const MetricCard = ({
    value,
    label,
    hint,
    isSkeleton = false,
    classNames,
}: MetricCardProps) => {
    return (
        // SectionCard provides the framed card shell (border + bg + radius)
        <SectionCard classNames={classNames}>
            <StackV
                gap={3}
                body={
                    <>
                        {/* Primary metric value — large and visually prominent */}
                        <Typography size="h4" isSkeleton={isSkeleton} text={value} />

                        {/* Descriptive label — body-sm foreground, the prominent line */}
                        <Typography size="sm" isSkeleton={isSkeleton} text={label} />

                        {/* Optional hint — small + muted footnote, DISTINCT from the label.
                            While loading there is no `hint` to test yet, so the composite still
                            decides to shimmer a third line (the count is its call, not the atom's). */}
                        {hint !== undefined || isSkeleton ? (
                            <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={hint} />
                        ) : null}
                    </>
                }
            />
        </SectionCard>
    )
}
