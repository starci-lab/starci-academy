import React from "react"
import { Accordion, cn, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/marketing/TruthList`. Authored in Storybook (not `src`);
 * synced to `src` later. A "raw truth" manifesto: uncomfortable industry truths
 * (accordion triggers) each opening to a concrete "here's our answer" line.
 */

/** Local mirror of `@/modules/types/base/class-name` (storybook-local, no `@/` imports). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

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
    /** Storybook-only: emit `data-anat-part` markers on each anatomy part. */
    showAnatomy?: boolean
}

/**
 * A "raw truth" manifesto: a list of uncomfortable industry truths, each paired
 * with a concrete "→ here's our answer" line, closed
 * by an optional byline (who's saying it). Built for confrontational, grounded
 * positioning — the truths are the hero, the author recedes to a signature.
 * Tier-3 block on a surface frame; styling here, content via props.
 *
 * @param props - {@link TruthListProps}
 */
export const TruthList = ({ items, byline, className, showAnatomy }: TruthListProps) => {
    return (
        <div
            className={cn("overflow-hidden rounded-3xl bg-surface shadow-surface", className)}
            data-anat-part={showAnatomy ? "Surface frame" : undefined}
        >
            {/* Accordion Card: khung p-0 flush, accordion surface tự lo nền + separator + bo góc.
                Mỗi sự thật = trigger (statement) bấm mở ra phần giải. KHÔNG Accordion.Indicator
                → không caret (thầy chốt); hover trigger là affordance. */}
            <Accordion
                variant="surface"
                className="!rounded-none [&_*]:!rounded-none"
                data-anat-part={showAnatomy ? "Accordion" : undefined}
            >
                {/* accordion vuông toàn bộ → khung ngoài (overflow-hidden rounded-3xl) lo bo góc;
                    item cuối flush phẳng với byline, không bo lòi khi hover. */}
                {items.map((item, index) => (
                    <Accordion.Item
                        key={index}
                        aria-label={typeof item.truth === "string" ? item.truth : `truth-${index}`}
                        data-anat-part={showAnatomy ? "Accordion.Item" : undefined}
                    >
                        <Accordion.Heading data-anat-part={showAnatomy ? "Accordion.Heading" : undefined}>
                            <Accordion.Trigger data-anat-part={showAnatomy ? "Accordion.Trigger" : undefined}>
                                <Typography
                                    type="body"
                                    weight="medium"
                                    className="text-left"
                                >
                                    {item.truth}
                                </Typography>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel data-anat-part={showAnatomy ? "Accordion.Panel" : undefined}>
                            <Accordion.Body data-anat-part={showAnatomy ? "Accordion.Body" : undefined}>
                                <Typography
                                    type="body-sm"
                                    color="muted"
                                >
                                    {item.fix}
                                </Typography>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
            {byline ? (
                <div
                    className="flex flex-wrap items-center gap-3 border-t border-default px-5 py-4"
                    data-anat-part={showAnatomy ? "Byline row" : undefined}
                >
                    {byline}
                </div>
            ) : null}
        </div>
    )
}
