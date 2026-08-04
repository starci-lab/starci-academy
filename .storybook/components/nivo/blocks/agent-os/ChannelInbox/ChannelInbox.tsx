import { ChatsCircleIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ChannelInbox` — the pod's conversation threads across every connected
 * channel, the VOLUME region of Agent OS: a paged list, each row opening into
 * `ThreadDrawer`. Two DATA states of the single shape: `empty` and
 * `with-rows`, client-paged the same way `SubmissionAttemptsDrawer` is.
 */

/** A channel a thread can be running on. */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** One conversation thread, newest-activity first. */
export interface ChannelInboxThread {
    /** Stable id. */
    id: string
    /** The customer's display name. */
    customerName: string
    /** Which channel the thread is running on. */
    channel: AgentOsChannelKind
    /** Last message preview, single line. */
    previewText: string
    /** Already-humanized relative time (e.g. "2 minutes ago"). */
    timeLabel: string
    /** `true` → the row carries the unread signal. */
    hasUnread: boolean
}

/** Props for {@link ChannelInbox}. */
export interface ChannelInboxProps {
    /** The CURRENT PAGE of threads — the caller (or the paging formula in a story) slices the full set. */
    threads: ReadonlyArray<ChannelInboxThread>
    /** 1-based current page. */
    currentPage: number
    /** Total number of pages. */
    totalPages: number
    /** Fires with a 1-based page number when the reader changes page. */
    onPageChange: (pageNumber: number) => void
    /** Opens one thread into {@link ThreadDrawer}. */
    onOpenThread: (threadId: string) => void
    /**
     * `true` → the inbox's own first fetch is in flight: the same titled card
     * renders a fixed count of thread-shaped rows with every content node
     * shimmering, the pager and the per-row press are dropped. Threaded
     * straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ChannelInboxLabels
}

/** The already-resolved copy the inbox renders. */
export interface ChannelInboxLabels {
    /** Card title (e.g. "Conversations"). */
    title: string
    /** Accessible name for a pressable thread row (e.g. "Open conversation"). */
    openAriaLabel: string
    /** Accessible name for the pager. */
    pagerAriaLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder rows the loading mirror draws while `threads` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_THREADS: ReadonlyArray<ChannelInboxThread> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    customerName: "Customer name",
    channel: "zalo",
    previewText: "Last message preview text goes here",
    timeLabel: "—",
    hasUnread: false,
}))

/**
 * One thread row — avatar, customer name (+ unread dot), preview line, and the
 * relative time on the trailing edge. The SAME shape drives the loaded and
 * loading rows; `isSkeleton` threads down so a loading row is the loaded row
 * with its content nodes shimmering and the press dropped (there is no id to
 * open yet).
 */
const ThreadRow = ({ thread, onOpen, labels, isSkeleton }: {
    thread: ChannelInboxThread
    onOpen: () => void
    labels: ChannelInboxLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        {...(!isSkeleton ? { onPress: onOpen, ariaLabel: `${labels.openAriaLabel}: ${thread.customerName}` } : {})}
        body={() => (
            <StackH
                gap={3}
                align="center"
                isSkeleton={isSkeleton}
                items={[
                    () => <Avatar name={thread.customerName} seed={thread.id} size="sm" isSkeleton={isSkeleton} />,
                    () => (
                        <StackV
                            gap={1}
                            classNames={["min-w-0", "flex-1"]}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackH
                                        gap={2}
                                        align="center"
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={thread.customerName} />,
                                            ...(!isSkeleton && thread.hasUnread ? [() => <Badge dot color="accent" size="sm" />] : []),
                                        ]}
                                    />
                                ),
                                () => <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={thread.previewText} />,
                            ]}
                        />
                    ),
                    () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} classNames={["shrink-0"]} text={thread.timeLabel} />,
                ]}
            />
        )}
    />
)

/**
 * The paged conversation inbox. See the file header for why empty vs
 * with-rows are states of one shape rather than separate leaves, and how
 * `isSkeleton` mirrors the loaded rows.
 *
 * @param props - {@link ChannelInboxProps}
 */
const ChannelInbox = ({ threads, currentPage, totalPages, onPageChange, onOpenThread, isSkeleton = false, labels }: ChannelInboxProps) => {
    const rows = isSkeleton ? SKELETON_THREADS : threads
    const isEmpty = !isSkeleton && threads.length === 0
    return (
        <div data-tier="block" data-component="ChannelInbox">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() =>
                    isEmpty ? (
                        <EmptyState icon={ChatsCircleIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                    ) : (
                        <StackV
                            gap={4}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackV
                                        gap={2}
                                        isSkeleton={isSkeleton}
                                        items={rows.map((thread) => () => (
                                            <ThreadRow thread={thread} onOpen={() => onOpenThread(thread.id)} labels={labels} isSkeleton={isSkeleton} />
                                        ))}
                                    />
                                ),
                                ...(!isSkeleton && totalPages > 1 ? [() => (
                                    <nav aria-label={labels.pagerAriaLabel}>
                                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                                    </nav>
                                )] : []),
                            ]}
                        />
                    )
                }
            />
        </div>
    )
}

export { ChannelInbox }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ChannelInbox" } as const
