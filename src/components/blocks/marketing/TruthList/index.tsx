import React from "react"
import { Accordion, Typography } from "@heroui/react"
/** One blunt truth + how the product answers it. */
export interface TruthListItem {
    /** The uncomfortable truth (the headline statement). */
    truth: React.ReactNode
    /** What we do about it (the proof line — keep it concrete). */
    fix: React.ReactNode
}

/** Props for the {@link TruthList} block. */
export interface TruthListProps {
    /** Ordered truths — each a broken industry reality + the product's answer. */
    items: Array<TruthListItem>
    /** Optional signature footer (who is saying this) — e.g. a founder byline. */
    byline?: React.ReactNode
}

/**
 * A "raw truth" manifesto: a list of uncomfortable industry truths, each paired
 * with a concrete "→ here's our answer" line, closed
 * by an optional byline (who's saying it). Built for confrontational, grounded
 * positioning — the truths are the hero, the author recedes to a signature.
 * Tier-3 block on {@link SectionCard}; styling here, content via props.
 *
 * @param props - {@link TruthListProps}
 */
export const TruthList = ({ items, byline}: TruthListProps) => {
    return (
        <div className={"overflow-hidden rounded-3xl bg-surface shadow-surface"}>
            {/* Accordion Card: p-0 flush frame, the accordion surface owns its background + separators + corner radius.
                Each truth = a trigger (statement) that opens its explanation. NO Accordion.Indicator
                → no caret (teacher's ruling); the trigger hover is the affordance. */}
            <Accordion variant="surface" className="!rounded-none [&_*]:!rounded-none">
                {/* the accordion is fully square → the outer frame (overflow-hidden rounded-3xl) owns the radius;
                    the last item sits flush with the byline and never bleeds a rounded edge on hover. */}
                {items.map((item, index) => (
                    <Accordion.Item
                        key={index}
                        aria-label={typeof item.truth === "string" ? item.truth : `truth-${index}`}
                    >
                        <Accordion.Heading>
                            <Accordion.Trigger>
                                <Typography type="body" weight="medium" className="text-left">
                                    {item.truth}
                                </Typography>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body>
                                <Typography type="body-sm" color="muted">
                                    {item.fix}
                                </Typography>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
            {byline ? (
                <div className="flex flex-wrap items-center gap-3 border-t border-default px-5 py-4">
                    {byline}
                </div>
            ) : null}
        </div>
    )
}
