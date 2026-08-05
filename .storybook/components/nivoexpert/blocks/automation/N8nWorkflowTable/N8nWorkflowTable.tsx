import type { ReactNode } from "react"
import { ArrowClockwiseIcon, FlowArrowIcon, TreeStructureIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { ChoiceSwitch } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `N8nWorkflowTable` -- the "n8n workflows" tab. A table of the expert's workflows
 * (name - webhook - active toggle) plus a recent-executions list and a labelled
 * region standing in for the embedded n8n editor. The three phases -- `empty`,
 * `with-workflows`, `with-executions` -- are DATA, so they are STATES of the single
 * shape. Grounded in the real `N8nToolsService.listAll()` / `executions()` and
 * `setActive(id, active)` behind the toggle.
 */

/** One workflow row -- a subset of the real `listAll()` result. */
export interface WorkflowRowView {
    /** Workflow id in n8n. */
    id: string
    /** Readable workflow name (`N8nTool.description`). */
    name: string
    /** Webhook path that fires it, or null when it has no Webhook trigger (`N8nTool.webhookPath`). */
    webhookPath?: string | null
    /** Whether the workflow is active in n8n (`active` from `listAll()`). */
    active: boolean
}

/** The three execution statuses n8n reports. */
export type ExecutionStatus = "success" | "error" | "running"

/** One recent run -- a subset of the real `executions()` result. */
export interface ExecutionRowView {
    /** Execution id. */
    id: string
    /** Name of the workflow that ran (resolved from `workflowId`). */
    workflowName: string
    /** Run status (`execution.status`). */
    status: ExecutionStatus
    /** Already-formatted start time, or null when unknown (`execution.startedAt`). */
    startedAtLabel?: string | null
}

/** Props for {@link N8nWorkflowTable}. */
export interface N8nWorkflowTableProps {
    /** The workflows, in listing order. Empty is the `empty` state. */
    workflows: Array<WorkflowRowView>
    /** Recent runs, newest first. Empty hides the executions section. */
    executions: Array<ExecutionRowView>
    /** Turn a workflow on/off -- the connected layer runs `setActive(id, active)`. */
    onToggleWorkflow: (id: string, active: boolean) => void
    /** Id of the workflow whose toggle is in flight (its switch locks), or null. */
    togglingId?: string | null
    /** Re-read the workflow list and recent runs from n8n. */
    onReload: () => void
    /**
     * `true` -> the block's own first fetch is in flight: the manage card keeps its
     * title and renders a fixed count of workflow-shaped rows with every cell
     * shimmering (§12b), the reload action and row toggles go inert, and the
     * executions card is skipped (nothing has run yet). Threaded straight down --
     * never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: N8nWorkflowTableLabels
}

/** The already-resolved copy the block renders. */
export interface N8nWorkflowTableLabels {
    /** Card title (e.g. "Manage workflows"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Reload button label. */
    reloadLabel: string
    /** Column header for the workflow name. */
    workflowColumn: string
    /** Column header for the webhook path. */
    webhookColumn: string
    /** Column header for the active toggle. */
    activeColumn: string
    /** Toggle label / status when the workflow is active. */
    activeLabel: string
    /** Toggle label / status when the workflow is inactive. */
    inactiveLabel: string
    /** Accessible name for the workflow table. */
    tableAriaLabel: string
    /** Shown for a workflow with no Webhook trigger. */
    noWebhookLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
    /** Recent-executions section title. */
    executionsTitle: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<ExecutionStatus, string>
    /** Editor-placeholder title. */
    editorPlaceholderTitle: string
    /** Editor-placeholder supporting line. */
    editorPlaceholderDescription: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { workflow: "workflow", webhook: "webhook", active: "active" } as const

/** Execution status -> chip tone. Success is healthy, error is a failure, running is in progress. */
const STATUS_TONE: Record<ExecutionStatus, ChipTone> = {
    success: "success",
    error: "danger",
    running: "warning",
}

/** How many placeholder rows the loading mirror draws while `workflows` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder workflows -- sized like a real row so the table's shimmer mirrors the loaded shape. */
const SKELETON_WORKFLOWS: Array<WorkflowRowView> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Workflow name",
    webhookPath: "webhook-path",
    active: true,
}))

/**
 * The workflow-management table. See the file header for why empty, with-workflows,
 * and with-executions are states of one shape rather than separate leaves.
 *
 * @param props - {@link N8nWorkflowTableProps}
 */
const N8nWorkflowTable = ({
    workflows,
    executions,
    onToggleWorkflow,
    togglingId,
    onReload,
    isSkeleton = false,
    labels,
}: N8nWorkflowTableProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.workflow, header: labels.workflowColumn },
        { key: COLUMN_KEY.webhook, header: labels.webhookColumn },
        { key: COLUMN_KEY.active, header: labels.activeColumn, align: "end" },
    ]

    // While loading the table renders the SAME shape from a fixed count of
    // placeholder workflows; `isSkeleton` threads into every cell so the toggle
    // and text go inert and shimmer instead of exposing a real control.
    const workflowRows = isSkeleton ? SKELETON_WORKFLOWS : workflows
    const rows: ReadonlyArray<TableRowItem> = workflowRows.map((workflow): TableRowItem => ({
        key: workflow.id,
        [COLUMN_KEY.workflow]: <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={workflow.name} />,
        [COLUMN_KEY.webhook]: (
            <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={workflow.webhookPath ?? labels.noWebhookLabel} />
        ),
        [COLUMN_KEY.active]: (
            <ChoiceSwitch
                isSelected={workflow.active}
                onValueChange={(next) => onToggleWorkflow(workflow.id, next)}
                isDisabled={isSkeleton || togglingId === workflow.id}
                isSkeleton={isSkeleton}
                label={workflow.active ? labels.activeLabel : labels.inactiveLabel}
            />
        ),
    }))

    /** One recent-run row: a status chip and the workflow name + time. */
    const executionRow = (execution: ExecutionRowView): ReactNode => (
        <StackH
            gap={3}
            items={[
                () => <Chip tone={STATUS_TONE[execution.status]} text={labels.statusOptions[execution.status]} />,
                () => (
                    <Typography
                        size="xs"
                        color="muted"
                        text={
                            execution.startedAtLabel
                                ? `${execution.workflowName} · ${execution.startedAtLabel}`
                                : execution.workflowName
                        }
                    />
                ),
            ]}
        />
    )

    /** The manage card: reload action, then the table or the empty state. */
    const ManageCard = () => (
        <SurfaceCard
            padding={3}
            label={labels.title}
            isSkeleton={isSkeleton}
            action={isSkeleton ? undefined : () => (
                <Button
                    variant="secondary"
                    size="sm"
                    prefixIcon={ArrowClockwiseIcon}
                    label={labels.reloadLabel}
                    onPress={onReload}
                />
            )}
            body={() => (
                <StackV
                    gap={3}
                    isSkeleton={isSkeleton}
                    items={[
                        () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={labels.description} />,
                        () =>
                            !isSkeleton && workflows.length === 0 ? (
                                <EmptyState
                                    icon={FlowArrowIcon}
                                    title={labels.emptyTitle}
                                    description={labels.emptyDescription}
                                />
                            ) : (
                                <Table columns={columns} items={rows} ariaLabel={labels.tableAriaLabel} isSkeleton={isSkeleton} />
                            ),
                    ]}
                />
            )}
        />
    )

    /** The recent-runs card -- only rendered when at least one run exists. */
    const ExecutionsCard = () => (
        <SurfaceCard
            padding={3}
            label={labels.executionsTitle}
            body={() => (
                <StackV gap={2} items={executions.map((execution) => () => executionRow(execution))} />
            )}
        />
    )

    /** The labelled region standing in for the embedded n8n editor iframe. */
    const EditorPlaceholder = () => (
        <SurfaceCard
            variant="nested"
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <EmptyState
                    icon={TreeStructureIcon}
                    title={labels.editorPlaceholderTitle}
                    description={labels.editorPlaceholderDescription}
                />
            )}
        />
    )

    return (
        <div data-tier="block" data-component="N8nWorkflowTable">
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    () => <ManageCard />,
                    // Executions are DATA that arrives with the first fetch -- while
                    // loading there is nothing to show, so the card is skipped (same
                    // omission the loaded `executions.length > 0` guard makes).
                    ...(!isSkeleton && executions.length > 0 ? [() => <ExecutionsCard />] : []),
                    () => <EditorPlaceholder />,
                ]}
            />
        </div>
    )
}

export { N8nWorkflowTable }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "N8nWorkflowTable" } as const
