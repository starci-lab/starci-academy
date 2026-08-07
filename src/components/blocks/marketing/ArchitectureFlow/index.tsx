import React from "react"
import { Typography } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"

/** Props for the {@link ArchitectureFlow} block. */
export interface ArchitectureFlowProps {
    /** Ordered node labels rendered as boxes joined by caret connectors (left → right). */
    nodes: ReadonlyArray<string>
}

/**
 * A compact, coded mini-architecture diagram: labelled node boxes joined by caret
 * connectors — a representative system flow (e.g. `Client → Fanout → Cache → DB`).
 * Pure CSS, no image. Wraps on narrow widths. Tier-3 block — owns styling, content
 * via props. Use to visualise "the real systems you build" without screenshots.
 *
 * @param props - {@link ArchitectureFlowProps}
 */
export const ArchitectureFlow = ({ nodes}: ArchitectureFlowProps) => {
    return (
        <div className={"flex flex-wrap items-center gap-2"}>
            {nodes.map((node, index) => (
                <React.Fragment key={`${node}-${index}`}>
                    {index > 0 ? (
                        <CaretRightIcon aria-hidden focusable="false" className="size-3 shrink-0 text-muted" />
                    ) : null}
                    <span className="rounded-md border border-default bg-default px-2 py-1">
                        <Typography type="code" className="text-xs">
                            {node}
                        </Typography>
                    </span>
                </React.Fragment>
            ))}
        </div>
    )
}
