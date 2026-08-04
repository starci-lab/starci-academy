import { LifebuoyIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `SupportTicketList` — the user's support tickets, each openable into its thread,
 * plus a header new-ticket trigger. Two DATA states of the single shape: `empty`
 * and `with-rows`. Grounded in the real `SupportTicketEntity`.
 */

/** The three ticket statuses — mirrors `TicketStatus` (`open` · `answered` · `closed`). */
export type TicketStatusKey = "open" | "answered" | "closed"

/** One ticket row — a subset of `SupportTicketEntity`. */
export interface SupportTicketRow {
    /** Ticket id. */
    id: string
    /** Short subject line (`SupportTicketEntity.subject`). */
    subject: string
    /** Where the ticket sits in its lifecycle (`SupportTicketEntity.status`). */
    status: TicketStatusKey
    /** Already-formatted last-activity date (`SupportTicketEntity.createdAt`). */
    dateLabel: string
}

/** Props for {@link SupportTicketList}. */
export interface SupportTicketListProps {
    /** The tickets, newest first. */
    tickets: Array<SupportTicketRow>
    /** Open one ticket into its thread. */
    onOpenTicket: (ticketId: string) => void
    /** Open the new-ticket flow. */
    onNewTicket: () => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of ticket-shaped rows with every content node
     * shimmering (§12b), and both the header new-ticket trigger and the per-row
     * press are dropped. Threaded straight down — never fed to a separate skeleton
     * tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: SupportTicketListLabels
}

/** The already-resolved copy the block renders. */
export interface SupportTicketListLabels {
    /** Card title (e.g. "Support"). */
    title: string
    /** New-ticket button label. */
    newLabel: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<TicketStatusKey, string>
    /** Accessible name for a pressable ticket row (e.g. "Open ticket"). */
    openAriaLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Status → chip tone. Open awaits us (accent), answered is on the user (success), closed is done (muted default). */
const STATUS_TONE: Record<TicketStatusKey, ChipTone> = {
    open: "accent",
    answered: "success",
    closed: "default",
}

/** How many placeholder rows the loading mirror draws while `tickets` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_TICKETS: Array<SupportTicketRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    subject: "Support ticket subject",
    status: "open",
    dateLabel: "01/01/2026",
}))

/**
 * One ticket row — subject + date on the left, status chip on the right, the whole
 * row a press target that opens the thread. The SAME shape drives the loaded and
 * the loading rows; `isSkeleton` threads down so a loading row is the loaded row
 * with its content nodes shimmering and the press dropped (there is no id to open
 * yet).
 */
const SupportTicketRowItem = ({ ticket, onOpenTicket, labels, isSkeleton }: {
    ticket: SupportTicketRow
    onOpenTicket: (ticketId: string) => void
    labels: SupportTicketListLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        {...(!isSkeleton
            ? { onPress: () => onOpenTicket(ticket.id), ariaLabel: `${labels.openAriaLabel}: ${ticket.subject}` }
            : {})}
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
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={ticket.subject} />,
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={ticket.dateLabel} />,
                            ]}
                        />
                    ),
                    () => (
                        <Chip
                            tone={STATUS_TONE[ticket.status]}
                            isSkeleton={isSkeleton}
                            text={labels.statusOptions[ticket.status]}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * The ticket list. See the file header for why empty vs with-rows are states of
 * one shape rather than separate leaves, and how `isSkeleton` mirrors the loaded
 * rows.
 *
 * @param props - {@link SupportTicketListProps}
 */
const SupportTicketList = ({ tickets, onOpenTicket, onNewTicket, isSkeleton = false, labels }: SupportTicketListProps) => {
    const rows = isSkeleton ? SKELETON_TICKETS : tickets
    return (
        <div data-tier="block" data-component="SupportTicketList">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => (
                    <Button
                        variant="secondary"
                        size="sm"
                        prefixIcon={PlusIcon}
                        label={labels.newLabel}
                        onPress={onNewTicket}
                    />
                )}
                body={() =>
                    !isSkeleton && tickets.length === 0 ? (
                        <EmptyState
                            icon={LifebuoyIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((ticket) => () => (
                                <SupportTicketRowItem ticket={ticket} onOpenTicket={onOpenTicket} labels={labels} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { SupportTicketList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SupportTicketList" } as const
