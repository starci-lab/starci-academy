import type { ComponentType, SVGProps } from "react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"

/**
 * `OperatingLoopRail` — the dashboard's compact read of the six-stage
 * Operating Loop (Website -> Lead -> CRM -> Workflow -> AI Agent ->
 * Dashboard): a pill per stage, lit accent for whichever the account has
 * wired up. `activeNodeIds` is the one leaf — a set rather than a single
 * active stage, since a real account can have several stages live at once.
 */

/** An icon component (e.g. a phosphor `*Icon`), not JSX — the atom scales it itself. */
export type OperatingLoopRailIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One stage of the rail. */
export interface OperatingLoopRailNode {
    /** Stable id — also what {@link OperatingLoopRailProps.activeNodeIds} matches against. */
    id: string
    /** Visible stage label (e.g. "Website"). */
    label: string
    /** The stage's icon. */
    icon: OperatingLoopRailIcon
}

/** Props for {@link OperatingLoopRail}. */
export interface OperatingLoopRailProps {
    /** The rail's stages, in order — the brand's loop is six: Website -> Dashboard. */
    nodes: Array<OperatingLoopRailNode>
    /** Which stage ids the account currently has wired up — lit accent. */
    activeNodeIds: Array<string>
    /**
     * `true` → the rail's own first fetch is in flight: every pill shimmers in
     * place, matching the loaded shape. Threaded straight down — never fed to
     * a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OperatingLoopRailLabels
}

/** The already-resolved copy the rail renders. */
export interface OperatingLoopRailLabels {
    /** Card title (e.g. "Your operating loop"). */
    title: string
}

/**
 * The stage rail. See the file header for why `activeNodeIds` is a set
 * instead of one active stage.
 *
 * @param props - {@link OperatingLoopRailProps}
 */
const OperatingLoopRail = ({ nodes, activeNodeIds, isSkeleton = false, labels }: OperatingLoopRailProps) => (
    <div data-tier="block" data-component="OperatingLoopRail">
        <SurfaceCard
            padding={3}
            label={labels.title}
            isSkeleton={isSkeleton}
            body={() => (
                <Cluster
                    gap={2}
                    isSkeleton={isSkeleton}
                    items={nodes.map((node) => () => (
                        <Chip
                            tone={activeNodeIds.includes(node.id) ? "accent" : "default"}
                            icon={node.icon}
                            isSkeleton={isSkeleton}
                            text={node.label}
                        />
                    ))}
                />
            )}
        />
    </div>
)

export { OperatingLoopRail }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OperatingLoopRail" } as const
