import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/DeadlineCallout`. Authored in Storybook (not
 * `src`); synced to `src` later.
 */

/** One day's bar in a {@link DeadlineCallout}'s forecast row. */
export interface DeadlineCalloutForecastBar {
    /** Short label under the bar (e.g. a weekday abbreviation). */
    label: ReactNode
    /** Fill height as a share of the row, `0..1` — the caller normalizes against the busiest day. */
    ratio: number
    /** True marks this as the overload day ("sẽ dồn cục") — fills danger instead of the neutral accent tone. */
    spike?: boolean
}

/** Props for the {@link DeadlineCallout} block. */
export interface DeadlineCalloutProps {
    /** How many items are about to be lost — rendered large inside the tinted panel. */
    count: number
    /** The deadline sentence (e.g. "12 thẻ sẽ tuột trước Thứ 5"). */
    title: ReactNode
    /** Optional supporting line under the title, inside the tinted panel. */
    hint?: ReactNode
    /** Optional per-day forecast bars below the panel. Omit when there is no lookahead data yet. */
    forecast?: DeadlineCalloutForecastBar[]
    /** Optional closing line under the forecast. */
    caption?: ReactNode
    /** Extra classes on the root element. */
    className?: string
}

/**
 * An urgency callout for items about to slip out of memory: a warning-soft
 * tinted panel carrying a big count + a deadline sentence, followed by an
 * optional per-day forecast bar row (one bar may be a red "spike" overload day)
 * and an optional closing caption. Verdict (count + sentence) → evidence
 * (forecast). Unlike the generic Callout, this block ALWAYS carries a countdown.
 * Pure/props-only.
 *
 * @param props - {@link DeadlineCalloutProps}
 */
export const DeadlineCallout = ({
    count,
    title,
    hint,
    forecast,
    caption,
    className,
}: DeadlineCalloutProps) => {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center gap-3 rounded-2xl border border-warning-soft-foreground bg-warning-soft p-3">
                <Typography type="h3" weight="bold" className="shrink-0 text-warning-soft-foreground">
                    {count}
                </Typography>
                <div className="flex min-w-0 flex-col gap-0">
                    <Typography type="body-sm" weight="semibold">
                        {title}
                    </Typography>
                    {hint ? (
                        <Typography type="body-xs" color="muted">
                            {hint}
                        </Typography>
                    ) : null}
                </div>
            </div>

            {forecast && forecast.length > 0 ? (
                <div className="flex items-end gap-2">
                    {forecast.map((bar, position) => (
                        // position-keyed: bars are a fixed lookahead window (e.g. next 7 days),
                        // never reordered/filtered at runtime like a normal list.
                        <div key={position} className="flex flex-1 flex-col items-center gap-1">
                            <div className="flex h-14 w-full items-end">
                                <div
                                    // min 6% keeps a near-empty day visible as a sliver instead of vanishing.
                                    style={{ height: `${Math.max(6, Math.round(bar.ratio * 100))}%` }}
                                    className={cn("w-full rounded-t", bar.spike ? "bg-danger/70" : "bg-accent/50")}
                                />
                            </div>
                            <Typography type="body-xs" color="muted">
                                {bar.label}
                            </Typography>
                        </div>
                    ))}
                </div>
            ) : null}

            {caption ? (
                <Typography type="body-xs" color="muted">
                    {caption}
                </Typography>
            ) : null}
        </div>
    )
}
