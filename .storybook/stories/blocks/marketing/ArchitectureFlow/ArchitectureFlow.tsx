import React from "react"
import { cn, Typography } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/marketing/ArchitectureFlow`. Authored in Storybook (not
 * `src`); synced to `src` later. A compact coded mini-architecture diagram —
 * labelled node boxes joined by caret connectors.
 */

/** Local mirror of `@/modules/types/base/class-name` (storybook-local, no `@/` imports). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for the {@link ArchitectureFlow} block. */
export interface ArchitectureFlowProps extends WithClassNames<undefined> {
    /** Ordered node labels rendered as boxes joined by caret connectors (left → right). */
    nodes: ReadonlyArray<string>
    /** When on, parts emit `data-anat-part` for the anatomy panel to anchor badges. */
    showAnatomy?: boolean
}

/**
 * A compact, coded mini-architecture diagram: labelled node boxes joined by caret
 * connectors — a representative system flow (e.g. `Client → Fanout → Cache → DB`).
 * Pure CSS, no image. Wraps on narrow widths. Tier-3 block — owns styling, content
 * via props. Use to visualise "the real systems you build" without screenshots.
 *
 * @param props - {@link ArchitectureFlowProps}
 */
export const ArchitectureFlow = ({ nodes, className, showAnatomy }: ArchitectureFlowProps) => {
    // The node box (span) + the connector (CaretRightIcon) are bare chrome — plain
    // HTML / a decorative glyph, not registered design-system components — so
    // neither gets an anatomy tag. The node LABEL is a Typography ArchitectureFlow
    // renders directly for its own `nodes` prop, so it DOES get one.
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {nodes.map((node, index) => (
                <React.Fragment key={`${node}-${index}`}>
                    {index > 0 ? (
                        <CaretRightIcon aria-hidden focusable="false" className="size-3 shrink-0 text-muted" />
                    ) : null}
                    <span className="rounded-md border border-default bg-default px-2 py-1">
                        <Typography type="code" className="text-xs" data-anat-part={showAnatomy ? "Typography" : undefined}>
                            {node}
                        </Typography>
                    </span>
                </React.Fragment>
            ))}
        </div>
    )
}
