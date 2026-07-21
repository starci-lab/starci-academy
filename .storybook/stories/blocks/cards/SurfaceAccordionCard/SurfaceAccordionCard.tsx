import React from "react"
import type { ReactNode } from "react"
import { Accordion, Typography, cn } from "@heroui/react"
import { SurfaceCardHeader, surfaceSectionGap, surfaceFrame, type SurfaceLabelProps } from "../surface-card-header"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `SurfaceAccordionCard` of the
 * `Surface*Card` family. Authored in Storybook (not `src`); synced to `src` later.
 */

/** One collapsible section of a {@link SurfaceAccordionCard}. */
export interface SurfaceAccordionCardItem {
    /** Stable id — also the expand key. */
    id: string
    /** Trigger headline (the always-visible row). */
    title: ReactNode
    /** Optional muted second line in the trigger. */
    subtitle?: ReactNode
    /** Optional trailing node in the trigger, left of the caret (a chip/count). */
    titleEnd?: ReactNode
    /** Panel content, revealed when the item expands. */
    body: ReactNode
}

/** Props for the target {@link SurfaceAccordionCard}. */
export interface SurfaceAccordionCardProps extends SurfaceLabelProps {
    /** The collapsible sections, in order. */
    items: ReadonlyArray<SurfaceAccordionCardItem>
    /** Allow more than one section open at once. Default `false`. */
    allowsMultipleExpanded?: boolean
    /** Sections expanded on mount, keyed by item `id` (a `Set`). */
    defaultExpandedKeys?: Set<string>
    /** `border border-default` instead of `shadow-surface` — for a nested surface. */
    bordered?: boolean
    /**
     * Shown (padded, centered) INSIDE the surface when `items` is empty — so an empty
     * accordion reads as an intentional empty state, not a blank card.
     */
    emptyState?: ReactNode
    /** Secondary node rendered OUTSIDE (below) the card, `gap-2` — a caption/prompt. */
    description?: ReactNode
    /** Extra classes on the outer section / surface. */
    className?: string
}

/** The bounded `bg-surface` frame of full-bleed collapsible rows. */
const AccordionFrame = ({
    items,
    allowsMultipleExpanded,
    defaultExpandedKeys,
    bordered,
}: Pick<SurfaceAccordionCardProps, "items" | "allowsMultipleExpanded" | "defaultExpandedKeys" | "bordered">) => (
    <div className={cn("overflow-hidden", surfaceFrame(bordered))}>
        <Accordion
            variant="default"
            style={{ "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)" } as React.CSSProperties}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
        >
            {items.map((item) => (
                <Accordion.Item key={item.id} id={item.id} aria-label={typeof item.title === "string" ? item.title : item.id}>
                    <Accordion.Heading>
                        <Accordion.Trigger>
                            <div className="flex min-w-0 flex-1 flex-col gap-0 text-left">
                                <Typography type="body-sm" weight="medium" truncate>{item.title}</Typography>
                                {item.subtitle != null ? (
                                    <Typography type="body-xs" color="muted" truncate>{item.subtitle}</Typography>
                                ) : null}
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                                {item.titleEnd}
                                <Accordion.Indicator />
                            </div>
                        </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                        <Accordion.Body className={cn("pt-0")}>{item.body}</Accordion.Body>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    </div>
)

/**
 * An "Accordion Card": one bounded `bg-surface` frame holding collapsible sections
 * whose separators run FULL-BLEED to the card edge — the same skin as
 * {@link import("../SurfaceListCard/SurfaceListCard").SurfaceListCard}, but each row
 * expands. Pass `label` for a section header baked in above the card; omit it and the
 * card renders bare (for a pane that already has a tab/heading).
 *
 * @param props - {@link SurfaceAccordionCardProps}
 */
export const SurfaceAccordionCard = ({
    label,
    labelEnd,
    onSeeMore,
    seeMoreLabel,
    action,
    subtleLabel = false,
    items,
    allowsMultipleExpanded = false,
    defaultExpandedKeys,
    bordered = false,
    emptyState,
    description,
    className,
}: SurfaceAccordionCardProps) => {
    // no items → show the empty state in the same bg-surface frame (never a bare, broken accordion)
    const frame = items.length === 0 && emptyState != null ? (
        <div className={cn("overflow-hidden p-8", surfaceFrame(bordered))}>
            {emptyState}
        </div>
    ) : (
        <AccordionFrame
            items={items}
            allowsMultipleExpanded={allowsMultipleExpanded}
            defaultExpandedKeys={defaultExpandedKeys}
            bordered={bordered}
        />
    )
    // bare = no header AND no caption → render the frame directly
    if (label == null && description == null) return <div className={cn(className)}>{frame}</div>
    // description sits OUTSIDE (below) the card, gap-2 — never surface-in-surface
    const withCaption = description != null ? (
        <div className="flex flex-col gap-2">
            {frame}
            {description}
        </div>
    ) : frame
    return (
        <section className={cn("flex flex-col", surfaceSectionGap(subtleLabel), className)}>
            <SurfaceCardHeader
                label={label}
                labelEnd={labelEnd}
                onSeeMore={onSeeMore}
                seeMoreLabel={seeMoreLabel}
                action={action}
                subtleLabel={subtleLabel}
            />
            {withCaption}
        </section>
    )
}
