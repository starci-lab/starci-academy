import { PuzzlePieceIcon } from "@phosphor-icons/react"
import { ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ToolsSection` — the Agent OS pod's "Tools" tab: the integrations an agent
 * can call, each switchable on/off for the whole pod. Two DATA states of the
 * single shape: `empty` and `with-rows`. A BASIC stub-section — the toggle is
 * real, per-agent tool assignment is deferred to `AgentDetailDrawer`.
 */

/** One tool row available to the pod. */
export interface AgentOsToolRow {
    /** Tool id. */
    id: string
    /** Readable tool name (e.g. "Order lookup", "Send payment link"). */
    name: string
    /** One-line description of what the tool lets an agent do. */
    description: string
    /** Whether the tool is currently available to the pod's agents. */
    isEnabled: boolean
}

/** Props for {@link ToolsSection}. */
export interface ToolsSectionProps {
    /** The tools available to the pod, in listing order. */
    tools: Array<AgentOsToolRow>
    /** Turn a tool on/off for the whole pod — the connected layer runs the mutation. */
    onToggleTool: (id: string, enabled: boolean) => void
    /** Id of the tool whose toggle is in flight (its switch locks), or null. */
    togglingId?: string | null
    /**
     * `true` → the section's own first fetch is in flight: the same titled
     * card renders a fixed count of tool-shaped rows with every content node
     * shimmering (§12b), and every toggle goes inert. Threaded straight down
     * — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ToolsSectionLabels
}

/** The already-resolved copy the block renders. */
export interface ToolsSectionLabels {
    /** Card title (e.g. "Tools"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Toggle label / status when the tool is enabled. */
    enabledLabel: string
    /** Toggle label / status when the tool is disabled. */
    disabledLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder rows the loading mirror draws while `tools` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_TOOLS: Array<AgentOsToolRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Tool name",
    description: "Tool description placeholder text.",
    isEnabled: true,
}))

/**
 * One tool row — name + description on the left, the on/off switch on the
 * right. The SAME shape drives the loaded and the loading rows; `isSkeleton`
 * threads down so a loading row is the loaded row with its content nodes
 * shimmering and the switch locked.
 */
const ToolRowItem = ({ tool, onToggleTool, togglingId, labels, isSkeleton }: {
    tool: AgentOsToolRow
    onToggleTool: (id: string, enabled: boolean) => void
    togglingId?: string | null
    labels: ToolsSectionLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={tool.name} />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={tool.description} />,
                            ]}
                        />
                    ),
                    () => (
                        <ChoiceSwitch
                            isSelected={tool.isEnabled}
                            onValueChange={(next) => onToggleTool(tool.id, next)}
                            isDisabled={isSkeleton || togglingId === tool.id}
                            isSkeleton={isSkeleton}
                            label={tool.isEnabled ? labels.enabledLabel : labels.disabledLabel}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * The pod's tools list. See the file header for why empty vs with-rows are
 * states of one shape rather than separate leaves, and how `isSkeleton`
 * mirrors the loaded rows.
 *
 * @param props - {@link ToolsSectionProps}
 */
const ToolsSection = ({ tools, onToggleTool, togglingId, isSkeleton = false, labels }: ToolsSectionProps) => {
    const rows = isSkeleton ? SKELETON_TOOLS : tools
    return (
        <div data-tier="block" data-component="ToolsSection">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && tools.length === 0 ? (
                        <EmptyState
                            icon={PuzzlePieceIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((tool) => () => (
                                <ToolRowItem tool={tool} onToggleTool={onToggleTool} togglingId={togglingId} labels={labels} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { ToolsSection }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ToolsSection" } as const
