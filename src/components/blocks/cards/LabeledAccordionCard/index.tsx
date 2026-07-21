import React from "react"
import type { ReactNode } from "react"
import { Accordion, Typography, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"

/** One collapsible section of a {@link LabeledAccordionCard}. */
export interface LabeledAccordionCardItem {
    /** Stable id — also the expand key (matched against `defaultExpandedKeys`). */
    id: string
    /** Trigger headline (the always-visible row). */
    title: ReactNode
    /** Optional muted second line in the trigger (a count / hint), under the title. */
    subtitle?: ReactNode
    /**
     * Optional trailing node in the trigger row, right of the title and LEFT of the
     * caret — a status chip / score / count that belongs to the collapsed header
     * (e.g. a per-requirement score, a milestone `StatusChip`, a read count). The
     * title truncates to make room; this stays at intrinsic width.
     */
    titleEnd?: ReactNode
    /** Panel content, revealed when the item expands. */
    body: ReactNode
}

/** Props for the {@link LabeledAccordionCard} block. */
export interface LabeledAccordionCardProps extends WithClassNames<undefined> {
    /**
     * Section label rendered OUTSIDE (above) the card — forwarded to {@link LabeledCard}.
     * OMIT it when the card sits in a pane that already carries a heading/tab of its
     * own (e.g. the Playground Lab "Tài nguyên" tab): a second label there is
     * label-on-label (accordion.md §3d). With no label the card renders bare
     * (just the {@link SurfaceListCard} frame), no section wrapper.
     */
    label?: ReactNode
    /** Optional passive right-aligned tag in the label row (count / unit). Ignored without `label`. */
    labelEnd?: ReactNode
    /** Optional right-aligned action slot in the label row (a button). Ignored without `label`. */
    action?: ReactNode
    /** The collapsible sections, in order. */
    items: ReadonlyArray<LabeledAccordionCardItem>
    /**
     * Allow more than one section open at once. Default `false` (a single-open
     * accordion). `allowsMultipleExpanded`, NOT `selectionMode` — that prop does
     * not exist on HeroUI's Accordion (accordion.md §3d).
     */
    allowsMultipleExpanded?: boolean
    /**
     * Sections expanded on mount, keyed by item `id`. A `Set`, not an array
     * (react-aria's collection key set — accordion.md §3d).
     */
    defaultExpandedKeys?: Set<string>
    /**
     * When this card sits NESTED inside another surface (a modal/drawer body),
     * pass `bordered` so it delineates with a border instead of a shadow that can
     * render invisible in dark mode (card.md §0). Forwarded to {@link SurfaceListCard}.
     */
    bordered?: boolean
}

/**
 * The collapsible frame — one bounded `bg-surface` card of sections whose separators
 * run FULL-BLEED to the card edge. Shared by the labeled and unlabeled forms.
 */
const AccordionFrame = ({
    items,
    allowsMultipleExpanded,
    defaultExpandedKeys,
    bordered,
}: Pick<
    LabeledAccordionCardProps,
    "items" | "allowsMultipleExpanded" | "defaultExpandedKeys" | "bordered"
>) => (
    <SurfaceListCard bordered={bordered}>
        {/* variant="default" (NOT surface): the base variant keeps the item separator
            FULL-BLEED (`left-0 w-full`); surface would inset it to 3%. The bg-surface
            frame + clipped corners come from SurfaceListCard, so the accordion stays
            transparent and rides on it (accordion.md §3e).

            Local `--separator` override: the base variant's separator token reads a bit
            heavy; re-point it to the SAME light hairline the SurfaceListCard rows use
            (`bg-surface-foreground/6`) so this card's dividers match the surface-list
            family. Overriding the token (which the item `::after` reads via `bg-separator`)
            is escape-free — no fighting HeroUI's unlayered `::after` with `!important`. */}
        <Accordion
            variant="default"
            style={{ "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)" } as React.CSSProperties}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
        >
            {items.map((item) => (
                <Accordion.Item
                    key={item.id}
                    id={item.id}
                    aria-label={typeof item.title === "string" ? item.title : item.id}
                >
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            <div className="flex min-w-0 flex-1 flex-col gap-0 text-left">
                                <Typography type="body-sm" weight="medium" truncate>
                                    {item.title}
                                </Typography>
                                {item.subtitle != null ? (
                                    <Typography type="body-xs" color="muted" truncate>
                                        {item.subtitle}
                                    </Typography>
                                ) : null}
                            </div>
                            {/* titleEnd + caret share one group so the trailing chip/count keeps
                                a `gap-3` breathing room from the indicator instead of touching it */}
                            <div className="flex shrink-0 items-center gap-3">
                                {item.titleEnd}
                                <Accordion.Indicator />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                        <Accordion.Body className={cn("pt-0")}>
                            {item.body}
                        </Accordion.Body>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </SurfaceListCard>
)

/**
 * A "Accordion Card": one bounded `bg-surface` frame holding collapsible sections
 * whose separators run FULL-BLEED to the card edge — the same skin as
 * {@link SurfaceListCard}, but each row expands. Pass {@link LabeledAccordionCardProps.label}
 * to add a section label OUTSIDE the card; omit it in a pane that already has a tab/heading.
 *
 * The full-bleed separator is why this uses `Accordion variant="default"` rather than
 * the usual `surface` skin: HeroUI's `.accordion--surface` insets the item separator to
 * `left-[3%] w-[94%]`, while the BASE variant keeps it `left-0 w-full`. The surface look
 * (bg + radius + clipped corners) is supplied by the wrapping {@link SurfaceListCard}, so
 * the accordion can stay transparent and ride on it (accordion.md §3d / §3e, card.md §3).
 *
 * Use when a "list card" needs its rows to collapse/expand by group (e.g. the Playground
 * Lab "Tài nguyên" tab grouped by kind) — never hand-roll a `<button>` + caret, which
 * reimplements the keyboard/aria HeroUI already ships. Each item's trigger is `title`
 * (+ optional `subtitle` line, + optional trailing `titleEnd` chip); the panel `body` is
 * free content.
 *
 * @param props - {@link LabeledAccordionCardProps}
 * @see Story: .storybook/stories/blocks/cards/LabeledAccordionCard/LabeledAccordionCard.stories
 */
export const LabeledAccordionCard = ({
    label,
    labelEnd,
    action,
    items,
    allowsMultipleExpanded = false,
    defaultExpandedKeys,
    bordered = false,
    className,
}: LabeledAccordionCardProps) => {
    const frame = (
        <AccordionFrame
            items={items}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
            bordered={bordered}
        />
    )
    // no label → the pane already carries a heading/tab; render the frame bare
    if (label == null) {
        return <div className={cn(className)}>{frame}</div>
    }
    return (
        <LabeledCard label={label} labelEnd={labelEnd} action={action} frameless className={className}>
            {frame}
        </LabeledCard>
    )
}
