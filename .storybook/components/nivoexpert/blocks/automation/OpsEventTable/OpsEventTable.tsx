import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Table, type TableColumnSpec, type TableRowItem } from "@sb-components/composites/data/Table/Table"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OpsEventTable` -- the "platform events" tab. A reference table mapping each
 * platform event the ops layer fires to n8n to its per-event webhook path and to
 * whether an active workflow listens. The event set is FIXED (five events), so the
 * block has a single state. Grounded in the real `N8nDispatcherService`, whose
 * `OpsEvent` union is these five and whose path is `nivo-<event with dots as dashes>`.
 */

/** The five platform events the ops layer fires -- mirrors the real `OpsEvent` union. */
export type OpsEventKey =
    | "member.registered"
    | "order.paid"
    | "lesson.completed"
    | "quiz.passed"
    | "certificate.issued"

/** One event row -- an event, when it fires, its webhook path, and whether a workflow listens. */
export interface OpsEventRowView {
    /** The platform event (`OpsEvent`). */
    event: OpsEventKey
    /** Human line for when the event fires. */
    whenLabel: string
    /** The per-event webhook path the dispatcher posts to (`nivo-<event dashed>`). */
    webhookPath: string
    /** Whether an active workflow currently listens on that path. */
    isListening: boolean
}

/** Props for {@link OpsEventTable}. */
export interface OpsEventTableProps {
    /** The events, in the order they should read. */
    events: Array<OpsEventRowView>
    /** Already-localized copy. */
    labels: OpsEventTableLabels
}

/** The already-resolved copy the block renders. */
export interface OpsEventTableLabels {
    /** Card title (e.g. "Platform events"). */
    title: string
    /** Supporting line under the title. */
    description: string
    /** Column header for the event name. */
    eventColumn: string
    /** Column header for when the event fires. */
    whenColumn: string
    /** Column header for the webhook path. */
    webhookColumn: string
    /** Column header for the listening status. */
    listeningColumn: string
    /** Chip label when a workflow listens. */
    listeningLabel: string
    /** Chip label when nothing listens. */
    notListeningLabel: string
    /** Accessible name for the events table. */
    tableAriaLabel: string
}

/** Column keys, shared by the header config and each row. */
const COLUMN_KEY = { event: "event", when: "when", webhook: "webhook", listening: "listening" } as const

/**
 * The platform-events reference table. See the file header for why this block has
 * a single state (the event set is fixed).
 *
 * @param props - {@link OpsEventTableProps}
 */
const OpsEventTable = ({ events, labels }: OpsEventTableProps) => {
    const columns: ReadonlyArray<TableColumnSpec> = [
        { key: COLUMN_KEY.event, header: labels.eventColumn },
        { key: COLUMN_KEY.when, header: labels.whenColumn },
        { key: COLUMN_KEY.webhook, header: labels.webhookColumn },
        { key: COLUMN_KEY.listening, header: labels.listeningColumn, align: "end" },
    ]

    const rows: ReadonlyArray<TableRowItem> = events.map((row): TableRowItem => {
        const tone: ChipTone = row.isListening ? "success" : "default"
        return {
            key: row.event,
            [COLUMN_KEY.event]: <Typography size="sm" weight="medium" text={row.event} />,
            [COLUMN_KEY.when]: <Typography size="sm" color="muted" text={row.whenLabel} />,
            [COLUMN_KEY.webhook]: <Typography size="sm" color="muted" text={row.webhookPath} />,
            [COLUMN_KEY.listening]: (
                <Chip tone={tone} text={row.isListening ? labels.listeningLabel : labels.notListeningLabel} />
            ),
        }
    })

    return (
        <div data-tier="block" data-component="OpsEventTable">
            <SurfaceCard
                padding={3}
                label={labels.title}
                body={() => (
                    <StackV
                        principle="sibling-stack" gap={3}
                        items={[
                            () => <Typography size="sm" color="muted" text={labels.description} />,
                            () => <Table columns={columns} items={rows} ariaLabel={labels.tableAriaLabel} />,
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { OpsEventTable }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OpsEventTable" } as const
