import { ArrowClockwiseIcon, FlowArrowIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Box } from "@sb-components/frames/Box/Box"
import type { SkeletonProps } from "@sb-components/frames/_slot"

/**
 * `PodN8nWorkflowList` — the workflows that exist on the POD's own n8n, read
 * straight from the running instance. A second, read-only list that sits BESIDE
 * the control plane's workflow table rather than replacing it: the two answer
 * different questions, and merging them would hide the ones the control plane
 * authored but the pod has never seen.
 *
 * `isActive` is the reason this block exists. An inactive workflow lists, reads
 * as finished, and never fires its trigger, so it carries a DANGER chip rather
 * than a muted one — a quiet grey row is how three dead workflows once looked
 * healthy for eleven hours.
 *
 * There is no toggle and no edit action, because the operation behind this list
 * offers neither. A no-op switch would be a dead control on the one surface whose
 * whole job is telling the truth about whether a workflow runs.
 *
 * `failure` is a NAMED REMEDY, not an error string: the pod has several distinct
 * ways to be unreachable and each has a different fix, so the caller hands the
 * sentence and the action rather than a code this block would have to interpret.
 */

/** One workflow as the pod's own n8n reports it. */
export interface PodN8nWorkflowRow {
    /** Workflow id on the pod's n8n. */
    id: string
    /** Readable workflow name. */
    name: string
    /** Whether the pod's n8n will actually fire this workflow's trigger. */
    isActive: boolean
    /** Already-formatted update time, or `null` when the pod reported none — never a fabricated date. */
    updatedAtLabel?: string | null
}

/** A named remedy for one way the pod's n8n could not be read. */
export interface PodN8nWorkflowFailure {
    /** What went wrong, in the reader's language. */
    title: string
    /** What to do about it. */
    description: string
    /** Label of the remedy action; omit for a failure with nothing to press. */
    actionLabel?: string
    /** The remedy itself. Only rendered together with `actionLabel`. */
    onAction?: () => void
}

/** The already-resolved copy the block renders. */
export interface PodN8nWorkflowListLabels {
    /** Card title. */
    title: string
    /** Supporting line under the title — say that this reads the pod, not the control plane. */
    description: string
    /** Column header for the workflow name. */
    workflowColumn: string
    /** Column header for the active/inactive state. */
    statusColumn: string
    /** Column header for the update time. */
    updatedColumn: string
    /** Chip text on a workflow the pod will fire. */
    activeLabel: string
    /** Chip text on a workflow the pod holds but will not fire. */
    inactiveLabel: string
    /** Stand-in when the pod reported no update time. */
    noUpdatedAtLabel: string
    /** Label of the re-read action in the card header. */
    refreshLabel: string
    /** Accessible name for the table. */
    tableAriaLabel: string
    /** Empty-state title — the pod answered, and it holds nothing. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Props for {@link PodN8nWorkflowList}. */
export interface PodN8nWorkflowListProps {
    /** The pod's workflows, in listing order. Empty is a real answer, not a failure. */
    workflows: ReadonlyArray<PodN8nWorkflowRow>
    /** Re-read the pod's n8n. */
    onRefresh: () => void
    /** A named remedy when the pod could not be read at all. See {@link PodN8nWorkflowFailure}. */
    failure?: PodN8nWorkflowFailure | null
    /**
     * `true` → the block's own first read is in flight: the card keeps its title
     * and draws a fixed count of workflow-shaped rows with every cell shimmering.
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: PodN8nWorkflowListLabels
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = {
    workflow: "workflow",
    status: "status",
    updated: "updated",
} as const

/** How many placeholder rows the loading mirror draws before the pod has answered. */
const SKELETON_ROW_COUNT = 3

/** Placeholder workflows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_WORKFLOWS: ReadonlyArray<PodN8nWorkflowRow> = Array.from(
    { length: SKELETON_ROW_COUNT },
    (_unused, index) => ({
        id: `skeleton-${index}`,
        name: "Workflow name",
        isActive: true,
        updatedAtLabel: "Updated",
    }),
)

/**
 * The pod's own n8n workflows. See the file header for why `isActive` is loud and
 * why `failure` is a remedy rather than a message.
 *
 * @param props - {@link PodN8nWorkflowListProps}
 */
const PodN8nWorkflowList = ({
    workflows,
    onRefresh,
    failure = null,
    isSkeleton = false,
    labels,
}: PodN8nWorkflowListProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.workflow, header: labels.workflowColumn },
        { key: COLUMN_KEY.status, header: labels.statusColumn },
        { key: COLUMN_KEY.updated, header: labels.updatedColumn, align: "end" },
    ]

    const workflowRows = isSkeleton ? SKELETON_WORKFLOWS : workflows
    const rows: ReadonlyArray<TableRowItem> = workflowRows.map((workflow): TableRowItem => ({
        key: workflow.id,
        [COLUMN_KEY.workflow]: (
            <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={workflow.name} />
        ),
        // Danger, not grey: an inactive workflow is indistinguishable from a working
        // one at a glance unless the row says otherwise.
        [COLUMN_KEY.status]: (
            <Chip
                tone={workflow.isActive ? "success" : "danger"}
                isSkeleton={isSkeleton}
                text={workflow.isActive ? labels.activeLabel : labels.inactiveLabel}
            />
        ),
        [COLUMN_KEY.updated]: (
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}
                text={workflow.updatedAtLabel ?? labels.noUpdatedAtLabel}
            />
        ),
    }))

    const body = ({ isSkeleton: isBodySkeleton }: SkeletonProps) => {
        if (!isBodySkeleton && failure != null) {
            return (
                <EmptyState
                    icon={WarningIcon}
                    tone="danger"
                    title={failure.title}
                    description={failure.description}
                    action={
                        failure.actionLabel != null
                            ? () => (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    label={failure.actionLabel ?? ""}
                                    onPress={failure.onAction}
                                />
                            )
                            : undefined
                    }
                />
            )
        }
        if (!isBodySkeleton && workflows.length === 0) {
            return (
                <EmptyState
                    icon={FlowArrowIcon}
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                />
            )
        }
        return (
            <Table
                columns={columns}
                items={rows}
                ariaLabel={labels.tableAriaLabel}
                isSkeleton={isBodySkeleton}
            />
        )
    }

    return (
        // The block's identity is worn BY its root frame, never by a wrapper div
        // stacked on top just to hold a name — a block draws no shape of its own.
        <Box identity={{ tier: "block", component: "PodN8nWorkflowList" }}>
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                action={({ isSkeleton: isActionSkeleton }: SkeletonProps) => (
                    <Button
                        variant="ghost"
                        size="sm"
                        prefixIcon={ArrowClockwiseIcon}
                        label={labels.refreshLabel}
                        isSkeleton={isActionSkeleton}
                        onPress={isActionSkeleton ? undefined : onRefresh}
                    />
                )}
                body={body}
            />
        </Box>
    )
}

export { PodN8nWorkflowList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PodN8nWorkflowList" } as const
