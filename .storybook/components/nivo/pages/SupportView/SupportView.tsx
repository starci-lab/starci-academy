import type { ReactNode } from "react"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    SupportTicketList,
    type SupportTicketListLabels,
    type SupportTicketRow,
} from "@sb-components/nivo/blocks/support/SupportTicketList/SupportTicketList"
import {
    TicketThread,
    type TicketThreadLabels,
    type TicketThreadMessage,
    type TicketThreadStatusKey,
} from "@sb-components/nivo/blocks/support/TicketThread/TicketThread"

/**
 * `SupportView` — the PAGE at `/support`: the ticket list, opened into one
 * ticket's thread. `view` NAMES which sub-view is on screen — `list` or
 * `thread`. The NEW-TICKET MODAL is a separate overlay this page never mounts
 * itself — see `NewTicketModal`'s own story. A page's story is one complete
 * STATE per story — `loading`, `list-empty`, `list-populated`, `thread` — not
 * a leaf-per-prop map. Grounded in the real `SupportTicketEntity` +
 * `TicketMessageEntity`.
 */

/** Identity of the ticket behind an open thread — a subset of `SupportTicketEntity`. */
export interface SupportViewTicket {
    /** Subject line (`SupportTicketEntity.subject`). */
    subject: string
    /** Where the ticket sits in its lifecycle (`SupportTicketEntity.status`). */
    status: TicketThreadStatusKey
}

/** Already-localized copy for every region this page arranges. */
export interface SupportViewLabels {
    /** Forwarded to `SupportTicketList`. */
    list: SupportTicketListLabels
    /** Forwarded to `TicketThread`. */
    thread: TicketThreadLabels
    /** The `LinkBack` label above an open thread (e.g. "Back to tickets"). */
    backToList: string
}

/** The `list` sub-view's own data — every ticket, plus the list's own actions. */
interface SupportViewListView {
    view: "list"
    /** The user's tickets, newest first — forwarded to `SupportTicketList`. */
    tickets: Array<SupportTicketRow>
    /** Open one ticket into its thread. */
    onOpenTicket: (ticketId: string) => void
    /** Bubbles the new-ticket request up — this page never mounts the modal itself (see the file header). */
    onNewTicket: () => void
}

/** The `thread` sub-view's own data — one ticket opened up. */
interface SupportViewThreadView {
    view: "thread"
    /** The opened ticket's identity — forwarded to `TicketThread`. */
    ticket: SupportViewTicket
    /** The thread, oldest first — forwarded to `TicketThread`. */
    messages: Array<TicketThreadMessage>
    /** The composer's current text — forwarded to `TicketThread`. */
    replyValue: string
    /** Fires as the composer changes — forwarded to `TicketThread`. */
    onReplyChange: (value: string) => void
    /** Send the reply — forwarded to `TicketThread`. */
    onSendReply: () => void
    /** Returns to the `list` sub-view. */
    onBack: () => void
    /** `true` → a reply is in flight — forwarded to `TicketThread`. */
    isSending?: boolean
}

/**
 * Props for {@link SupportView} — a discriminated union on `view`, with a
 * leading `isSkeleton` branch bare of every other field: before the first
 * fetch resolves the page mirrors the `list` shape, the landing sub-view,
 * since there is nothing else yet to show.
 */
export type SupportViewProps =
    | { isSkeleton: true; labels: SupportViewLabels }
    | ((SupportViewListView | SupportViewThreadView) & { isSkeleton?: false; labels: SupportViewLabels })

/**
 * The `/support` page. See the file header for why the new-ticket modal never
 * mounts inside this tree.
 *
 * @param props - {@link SupportViewProps}
 */
const SupportView = (props: SupportViewProps) => {
    const shell = (children: ReactNode) => (
        <div
            data-tier="page"
            data-component="SupportView"
            className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8"
        >
            {children}
        </div>
    )

    // ── LOADING: mirrors the `list` shape, the landing sub-view.
    if (props.isSkeleton) {
        return shell(
            <SupportTicketList
                tickets={[]}
                onOpenTicket={() => {}}
                onNewTicket={() => {}}
                labels={props.labels.list}
                isSkeleton
            />,
        )
    }

    // ── THREAD: one ticket opened, with a back link up to the list.
    if (props.view === "thread") {
        return shell(
            <StackV
                gap={4}
                items={[
                    () => <LinkBack label={props.labels.backToList} onPress={props.onBack} />,
                    () => (
                        <TicketThread
                            subject={props.ticket.subject}
                            status={props.ticket.status}
                            messages={props.messages}
                            replyValue={props.replyValue}
                            onReplyChange={props.onReplyChange}
                            onSendReply={props.onSendReply}
                            isSending={props.isSending}
                            labels={props.labels.thread}
                        />
                    ),
                ]}
            />,
        )
    }

    // ── LIST: every ticket — `SupportTicketList` owns its own empty branch, so
    // a brand-new account with zero tickets still has a way onward (the
    // header new-ticket trigger).
    return shell(
        <SupportTicketList
            tickets={props.tickets}
            onOpenTicket={props.onOpenTicket}
            onNewTicket={props.onNewTicket}
            labels={props.labels.list}
        />,
    )
}

export { SupportView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "SupportView" } as const
