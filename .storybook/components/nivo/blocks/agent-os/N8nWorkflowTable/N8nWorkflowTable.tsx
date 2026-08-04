import { PencilSimpleIcon, FlowArrowIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `N8nWorkflowTable` — the Agent OS pod's "Workflows" section: one n8n
 * workflow per row (name · trigger · on/off · last run · edit). Two DATA
 * states of the single shape: `empty` and `with-workflows`. A fresh,
 * pod-scoped, dark-shell twin of the nivoexpert automation block of the same
 * name — structure only, not an import.
 */

/** One workflow row for a pod's Agent OS console. */
export interface AgentOsWorkflowRow {
    /** Workflow id in n8n. */
    id: string
    /** Readable workflow name. */
    name: string
    /** Already-resolved trigger line (e.g. "New message", "09:00 daily"). */
    triggerLabel: string
    /** Whether the workflow is currently active. */
    active: boolean
    /** Already-formatted time of the last run, or null when it has never run. */
    lastRunLabel?: string | null
}

/** Props for {@link N8nWorkflowTable}. */
export interface N8nWorkflowTableProps {
    /** The pod's workflows, in listing order. Empty is the `empty` state. */
    workflows: Array<AgentOsWorkflowRow>
    /** Turn a workflow on/off — the connected layer runs `setActive(id, active)`. */
    onToggleWorkflow: (id: string, active: boolean) => void
    /** Open a workflow for editing (deep-links into the n8n builder). */
    onEditWorkflow: (id: string) => void
    /** Id of the workflow whose toggle is in flight (its switch locks), or null. */
    togglingId?: string | null
    /**
     * `true` → the block's own first fetch is in flight: the card keeps its
     * title and renders a fixed count of workflow-shaped rows with every cell
     * shimmering (§12b), and the toggle/edit controls go inert. Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: N8nWorkflowTableLabels
}

/** The already-resolved copy the block renders. */
export interface N8nWorkflowTableLabels {
    /** Card title (e.g. "Workflows"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Column header for the workflow name. */
    workflowColumn: string
    /** Column header for the trigger. */
    triggerColumn: string
    /** Column header for the active toggle. */
    activeColumn: string
    /** Column header for the last-run time. */
    lastRunColumn: string
    /** Column header for the edit action (kept short — the row already reads). */
    actionsColumn: string
    /** Toggle label / status when the workflow is active. */
    activeLabel: string
    /** Toggle label / status when the workflow is inactive. */
    inactiveLabel: string
    /** Shown when a workflow has never run. */
    noLastRunLabel: string
    /** Edit-button label, shown on every row. */
    editLabel: string
    /** Accessible name for the workflow table. */
    tableAriaLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = {
    workflow: "workflow",
    trigger: "trigger",
    active: "active",
    lastRun: "lastRun",
    actions: "actions",
} as const

/** How many placeholder rows the loading mirror draws while `workflows` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder workflows — sized like a real row so the table's shimmer mirrors the loaded shape. */
const SKELETON_WORKFLOWS: Array<AgentOsWorkflowRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Workflow name",
    triggerLabel: "Trigger",
    active: true,
    lastRunLabel: "Last run",
}))

/**
 * The pod's workflow table. See the file header for why empty vs with-workflows
 * are states of one shape rather than separate leaves.
 *
 * @param props - {@link N8nWorkflowTableProps}
 */
const N8nWorkflowTable = ({
    workflows,
    onToggleWorkflow,
    onEditWorkflow,
    togglingId,
    isSkeleton = false,
    labels,
}: N8nWorkflowTableProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.workflow, header: labels.workflowColumn },
        { key: COLUMN_KEY.trigger, header: labels.triggerColumn },
        { key: COLUMN_KEY.active, header: labels.activeColumn, align: "end" },
        { key: COLUMN_KEY.lastRun, header: labels.lastRunColumn },
        { key: COLUMN_KEY.actions, header: labels.actionsColumn, align: "end" },
    ]

    // While loading the table renders the SAME shape from a fixed count of
    // placeholder workflows; `isSkeleton` threads into every cell so the toggle
    // and edit action go inert and shimmer instead of exposing a real control.
    const workflowRows = isSkeleton ? SKELETON_WORKFLOWS : workflows
    const rows: ReadonlyArray<TableRowItem> = workflowRows.map((workflow): TableRowItem => ({
        key: workflow.id,
        [COLUMN_KEY.workflow]: <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={workflow.name} />,
        [COLUMN_KEY.trigger]: <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={workflow.triggerLabel} />,
        [COLUMN_KEY.active]: (
            <ChoiceSwitch
                isSelected={workflow.active}
                onValueChange={(next) => onToggleWorkflow(workflow.id, next)}
                isDisabled={isSkeleton || togglingId === workflow.id}
                isSkeleton={isSkeleton}
                label={workflow.active ? labels.activeLabel : labels.inactiveLabel}
            />
        ),
        [COLUMN_KEY.lastRun]: (
            <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={workflow.lastRunLabel ?? labels.noLastRunLabel} />
        ),
        [COLUMN_KEY.actions]: (
            <Button
                variant="ghost"
                size="sm"
                prefixIcon={PencilSimpleIcon}
                label={labels.editLabel}
                isSkeleton={isSkeleton}
                onPress={isSkeleton ? undefined : () => onEditWorkflow(workflow.id)}
            />
        ),
    }))

    return (
        <div data-tier="block" data-component="N8nWorkflowTable">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && workflows.length === 0 ? (
                        <EmptyState
                            icon={FlowArrowIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <Table columns={columns} items={rows} ariaLabel={labels.tableAriaLabel} isSkeleton={isSkeleton} />
                    )
                }
            />
        </div>
    )
}

export { N8nWorkflowTable }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "N8nWorkflowTable" } as const
