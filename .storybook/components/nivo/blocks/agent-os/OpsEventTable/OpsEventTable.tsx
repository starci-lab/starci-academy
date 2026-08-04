import { ActivityIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"

/**
 * `OpsEventTable` — the Agent OS pod's timestamped activity feed: one event
 * per row (time · what happened · result). Two DATA states of the single
 * shape: `empty` and `with-events`. A fresh, pod-scoped, dark-shell block —
 * unrelated to the nivoexpert fixed platform-events reference table of the
 * same family name.
 */

/** The three outcomes a pod event can report. */
export type OpsEventResultKey = "success" | "info" | "failure"

/** One event row in the pod's recent-activity feed. */
export interface OpsEventFeedRow {
    /** Event id. */
    id: string
    /** Already-formatted time (e.g. "09:41"). */
    timeLabel: string
    /** Human line describing what happened (e.g. `Agent "Sales" replied on Zalo`). */
    description: string
    /** How the event resolved. */
    result: OpsEventResultKey
}

/** Props for {@link OpsEventTable}. */
export interface OpsEventTableProps {
    /** The events, newest first. Empty is the `empty` state. */
    events: Array<OpsEventFeedRow>
    /**
     * `true` → the feed's own first fetch is in flight: the card keeps its
     * title and renders a fixed count of event-shaped rows with every cell
     * shimmering (§12b). Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OpsEventTableLabels
}

/** The already-resolved copy the block renders. */
export interface OpsEventTableLabels {
    /** Card title (e.g. "Recent events"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Column header for the time. */
    timeColumn: string
    /** Column header for the event description. */
    eventColumn: string
    /** Column header for the result. */
    resultColumn: string
    /** The three result labels, keyed by result. */
    resultOptions: Record<OpsEventResultKey, string>
    /** Accessible name for the events table. */
    tableAriaLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { time: "time", event: "event", result: "result" } as const

/** Result → chip tone. Success is healthy, info is neutral, failure needs attention. */
const RESULT_TONE: Record<OpsEventResultKey, ChipTone> = {
    success: "success",
    info: "default",
    failure: "danger",
}

/** How many placeholder rows the loading mirror draws while `events` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** Placeholder events — sized like a real row so the table's shimmer mirrors the loaded shape. */
const SKELETON_EVENTS: Array<OpsEventFeedRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    timeLabel: "00:00",
    description: "Event description placeholder text",
    result: "success",
}))

/**
 * The pod's recent-events feed. See the file header for why empty vs
 * with-events are states of one shape rather than separate leaves.
 *
 * @param props - {@link OpsEventTableProps}
 */
const OpsEventTable = ({ events, isSkeleton = false, labels }: OpsEventTableProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.time, header: labels.timeColumn, width: "96px" },
        { key: COLUMN_KEY.event, header: labels.eventColumn },
        { key: COLUMN_KEY.result, header: labels.resultColumn, align: "end" },
    ]

    // While loading the table renders the SAME shape from a fixed count of
    // placeholder events; `isSkeleton` threads into every cell so it shimmers
    // instead of exposing placeholder content as if it were real activity.
    const eventRows = isSkeleton ? SKELETON_EVENTS : events
    const rows: ReadonlyArray<TableRowItem> = eventRows.map((event): TableRowItem => ({
        key: event.id,
        [COLUMN_KEY.time]: <Typography size="sm" color="muted" tabularNums isSkeleton={isSkeleton} text={event.timeLabel} />,
        [COLUMN_KEY.event]: <Typography size="sm" isSkeleton={isSkeleton} text={event.description} />,
        [COLUMN_KEY.result]: (
            <Chip tone={RESULT_TONE[event.result]} isSkeleton={isSkeleton} text={labels.resultOptions[event.result]} />
        ),
    }))

    return (
        <div data-tier="block" data-component="OpsEventTable">
            <SurfaceCard
                padding={3}
                label={labels.title}
                description={labels.description}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && events.length === 0 ? (
                        <EmptyState
                            icon={ActivityIcon}
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

export { OpsEventTable }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OpsEventTable" } as const
