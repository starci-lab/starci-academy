import type { ComponentType, SVGProps } from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OperatingLoopVisual` — the hero's six-stage flow rail (Website -> Lead -> CRM
 * -> Workflow -> AI Agent -> Dashboard). Which stage glows crimson is the one
 * leaf, so the story renders all six.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the atom scales it itself. */
export type OperatingLoopVisualIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One stage of the flow rail. */
export interface OperatingLoopVisualNode {
    /** Stable id — also what {@link OperatingLoopVisualProps.activeNodeId} matches against. */
    id: string
    /** Visible stage label (e.g. "Website"). */
    label: string
    /** The stage's icon. */
    icon: OperatingLoopVisualIcon
    /** `true` marks this stage as the AI layer — renders a small "AI" chip beneath it. */
    isAi?: boolean
}

/** Props for {@link OperatingLoopVisual}. */
export interface OperatingLoopVisualProps {
    /** The flow stages, in order (the brand's rail is six: Website -> Dashboard). */
    nodes: Array<OperatingLoopVisualNode>
    /** Which stage id currently glows crimson — the one leaf (every id is a state). */
    activeNodeId: string
}

/** One rail stage: an icon tile over its label, lit crimson while active. */
const FlowNode = ({ node, isActive }: { node: OperatingLoopVisualNode; isActive: boolean }) => (
    <StackV
        gap={1}
        align="center"
        items={[
            () => <IconTile icon={node.icon} tone={isActive ? "accent" : "default"} size="sm" />,
            () => (
                <Typography
                    size="xs"
                    weight={isActive ? "semibold" : "medium"}
                    color={isActive ? "accent" : "muted"}
                    align="center"
                    text={node.label}
                />
            ),
            ...(node.isAi ? [() => <Chip tone="accent" text="AI" />] : []),
        ]}
    />
)

/**
 * The six-stage flow rail. See the file header for why `activeNodeId` is the
 * one leaf.
 *
 * @param props - {@link OperatingLoopVisualProps}
 */
const OperatingLoopVisual = ({ nodes, activeNodeId }: OperatingLoopVisualProps) => (
    <div data-tier="block" data-component="OperatingLoopVisual">
        <Cluster
            gap={5}
            justify="center"
            separator
            items={nodes.map((node) => () => (
                <FlowNode node={node} isActive={node.id === activeNodeId} />
            ))}
        />
    </div>
)

export { OperatingLoopVisual }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OperatingLoopVisual" } as const
