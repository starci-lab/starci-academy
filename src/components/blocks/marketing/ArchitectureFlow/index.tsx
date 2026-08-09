import React from "react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { Cluster } from "@/components/frames/Cluster"

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
    const items = nodes.flatMap((node, index) => [
        ...(index > 0
            ? [() => (
                <Typography
                    size="xs"
                    color="muted"
                    prefixIcon={CaretRightIcon}
                    text=""
                />
            )]
            : []),
        () => <Chip text={node} />,
    ])

    return (
        <Cluster
            identity={{ tier: "block", component: "ArchitectureFlow" }}
            align="center"
            principle="chip-row"
            explain="Wrapping flow of node chips — not content-row, because these are repeating same-kind chips that wrap rather than a fixed primary/meta pair."
            items={items}
        />
    )
}
