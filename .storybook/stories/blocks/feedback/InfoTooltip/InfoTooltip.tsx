import React from "react"
import type { ReactNode } from "react"
import { Tooltip, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/InfoTooltip`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * InfoTooltip — the single way to attach a plain-language explanation to a hard
 * term (rank, tier, KPI, streak, league…). Wraps any trigger in a HeroUI Tooltip
 * and OWNS all the tooltip chrome (inset, max-width, arrow), so features pass only
 * a `title`/`description` (or a composed `content`) and the trigger as children.
 */

/** Props for {@link InfoTooltip}. */
export interface InfoTooltipProps {
    /** The trigger — the term / chip / label the tooltip explains. */
    children: ReactNode
    /** Bold heading line (e.g. the term itself). Omit for description-only. */
    title?: string
    /** The plain-language explanation. Ignored when {@link content} is given. */
    description?: string
    /**
     * Full custom body, overriding {@link title}/{@link description} — for richer
     * tooltips (multiple lines, highlighted values). Compose with `Typography`.
     */
    content?: ReactNode
    /** Tooltip placement relative to the trigger. Defaults to "top". */
    placement?: "top" | "bottom" | "left" | "right"
    /** Extra classes on the trigger. */
    className?: string
}

/**
 * Wraps any trigger in a HeroUI Tooltip and owns the tooltip chrome (inset,
 * max-width, arrow). The trigger keeps a `cursor-help` affordance so it reads as
 * "hover for more".
 *
 * @param props - {@link InfoTooltipProps}
 */
export const InfoTooltip = ({
    children,
    title,
    description,
    content,
    placement = "top",
    className,
}: InfoTooltipProps) => {
    return (
        <Tooltip delay={200}>
            <Tooltip.Trigger className={className}>
                <span className="inline-flex cursor-help">
                    {children}
                </span>
            </Tooltip.Trigger>
            <Tooltip.Content
                placement={placement}
                showArrow
                className="max-w-[260px]"
            >
                <Tooltip.Arrow />
                <div className="flex flex-col gap-1">
                    {content ?? (
                        <>
                            {title ? (
                                <Typography type="body-sm">
                                    {title}
                                </Typography>
                            ) : null}
                            {description ? (
                                <Typography type="body-xs" color="muted">
                                    {description}
                                </Typography>
                            ) : null}
                        </>
                    )}
                </div>
            </Tooltip.Content>
        </Tooltip>
    )
}
