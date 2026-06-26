import React from "react"
import { cn, Typography } from "@heroui/react"
import { CaretRightIcon, XCircleIcon } from "@phosphor-icons/react"
import { SectionCard } from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One blunt truth + how the product answers it. */
export interface TruthListItem {
    /** The uncomfortable truth (the headline statement). */
    truth: React.ReactNode
    /** What we do about it (the proof line — keep it concrete). */
    fix: React.ReactNode
}

/** Props for the {@link TruthList} block. */
export interface TruthListProps extends WithClassNames<undefined> {
    /** Ordered truths — each a broken industry reality + the product's answer. */
    items: Array<TruthListItem>
    /** Optional signature footer (who is saying this) — e.g. a founder byline. */
    byline?: React.ReactNode
}

/**
 * A "raw truth" manifesto: a list of uncomfortable industry truths, each marked
 * with a danger ✕ and paired with a concrete "→ here's our answer" line, closed
 * by an optional byline (who's saying it). Built for confrontational, grounded
 * positioning — the truths are the hero, the author recedes to a signature.
 * Tier-3 block on {@link SectionCard}; styling here, content via props.
 *
 * @param props - {@link TruthListProps}
 */
export const TruthList = ({ items, byline, className }: TruthListProps) => {
    return (
        <SectionCard className={cn(className)} contentClassName="flex flex-col gap-6">
            <ul className="flex flex-col gap-5">
                {items.map((item, index) => (
                    <li key={index} className="flex gap-3">
                        <XCircleIcon
                            aria-hidden
                            focusable="false"
                            className="mt-0.5 size-4 shrink-0 text-danger"
                        />
                        <div className="flex min-w-0 flex-col gap-1">
                            <Typography type="body" weight="medium">
                                {item.truth}
                            </Typography>
                            {/* answer line — a caret marks "here's what we do about it" */}
                            <div className="flex items-start gap-2">
                                <CaretRightIcon
                                    aria-hidden
                                    focusable="false"
                                    className="mt-0.5 size-4 shrink-0 text-muted"
                                />
                                <Typography type="body-sm" color="muted">
                                    {item.fix}
                                </Typography>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {byline ? (
                <div className="flex flex-wrap items-center gap-3 border-t border-default pt-5">
                    {byline}
                </div>
            ) : null}
        </SectionCard>
    )
}
