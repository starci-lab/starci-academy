import { PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `TicketThread` — one ticket opened up: status header, message bubbles by author,
 * and a reply composer. The variations are DATA states of the single shape:
 * `open`, `sending`, and `closed` (composer replaced by a closed line). Grounded
 * in the real `SupportTicketEntity` + `TicketMessageEntity`.
 */

/** The three ticket statuses — mirrors `TicketStatus` (`open` · `answered` · `closed`). */
export type TicketThreadStatusKey = "open" | "answered" | "closed"

/** Who wrote a message — mirrors `MessageAuthorRole` (`user` · `staff`). */
export type MessageAuthorRoleKey = "user" | "staff"

/** One message in the thread — a subset of `TicketMessageEntity`. */
export interface TicketThreadMessage {
    /** Message id. */
    id: string
    /** Who wrote it (`TicketMessageEntity.authorRole`) — drives alignment + tone. */
    authorRole: MessageAuthorRoleKey
    /** Body text (`TicketMessageEntity.body`). */
    body: string
    /** Already-formatted post time (`TicketMessageEntity.createdAt`). */
    dateLabel: string
}

/** Props for {@link TicketThread}. */
export interface TicketThreadProps {
    /** Subject line of the ticket (`SupportTicketEntity.subject`). */
    subject: string
    /** Ticket status (`SupportTicketEntity.status`). */
    status: TicketThreadStatusKey
    /** The thread, oldest first. */
    messages: Array<TicketThreadMessage>
    /** The composer's current text. */
    replyValue: string
    /** Fires as the composer changes. */
    onReplyChange: (value: string) => void
    /** Send the reply — the connected layer runs the mutation. */
    onSendReply: () => void
    /** `true` → the reply is in flight (send button busy, composer locks). */
    isSending?: boolean
    /**
     * `true` → the thread's own first fetch is in flight: the subject, status chip,
     * a fixed count of message-shaped bubbles, and the composer all shimmer (§12b),
     * and the send is dropped. Threaded straight down — never fed to a separate
     * skeleton tree. Independent from {@link isSending}, which is a live in-flight
     * reply on an already-loaded thread.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: TicketThreadLabels
}

/** The already-resolved copy the block renders. */
export interface TicketThreadLabels {
    /** The three status labels, keyed by status. */
    statusOptions: Record<TicketThreadStatusKey, string>
    /** The two author labels, keyed by role (e.g. "You" / "Support"). */
    authorOptions: Record<MessageAuthorRoleKey, string>
    /** Placeholder in the reply composer. */
    replyPlaceholder: string
    /** Send-button label. */
    sendLabel: string
    /** Accessible name for the composer field. */
    replyAriaLabel: string
    /** Line shown in place of the composer when the ticket is closed. */
    closedLabel: string
}

/** Status → chip tone. Open awaits us (accent), answered is on the user (success), closed is done (muted default). */
const STATUS_TONE: Record<TicketThreadStatusKey, ChipTone> = {
    open: "accent",
    answered: "success",
    closed: "default",
}

/** How many placeholder bubbles the loading mirror draws while `messages` hasn't landed yet. */
const SKELETON_BUBBLE_COUNT = 3

/** Placeholder messages — mixed authors so the shimmer mirrors the aligned loaded thread. */
const SKELETON_MESSAGES: Array<TicketThreadMessage> = Array.from(
    { length: SKELETON_BUBBLE_COUNT },
    (_unused, index): TicketThreadMessage => ({
        id: `skeleton-${index}`,
        authorRole: index === 1 ? "staff" : "user",
        body: "Ticket message body placeholder text.",
        dateLabel: "01/01/2026 09:00",
    }),
)

/**
 * One message bubble — author label, body, and post time, aligned by author (the
 * user's on the end, staff on the start). The SAME shape drives the loaded and the
 * loading bubbles; `isSkeleton` threads down so a loading bubble is the loaded
 * bubble with its content nodes shimmering.
 */
const MessageBubble = ({ message, labels, isSkeleton }: {
    message: TicketThreadMessage
    labels: TicketThreadLabels
    isSkeleton: boolean
}) => (
    <StackH
        gap={3}
        principle="flex-action"
        justify={message.authorRole === "user" ? "end" : "start"}
        isSkeleton={isSkeleton}
        items={[
            () => (
                <SurfaceCard
                    variant="nested"
                    padding={3}
                    isSkeleton={isSkeleton}
                    body={() => (
                        <StackV
                            gap={1}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography
                                        size="xs"
                                        weight="medium"
                                        color={message.authorRole === "user" ? "accent" : "muted"}
                                        isSkeleton={isSkeleton}
                                        text={labels.authorOptions[message.authorRole]}
                                    />
                                ),
                                () => (
                                    <Typography
                                        size="sm"
                                        preserveWhitespace
                                        isSkeleton={isSkeleton}
                                        text={message.body}
                                    />
                                ),
                                () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={message.dateLabel} />,
                            ]}
                        />
                    )}
                />
            ),
        ]}
    />
)

/**
 * The ticket thread. See the file header for why open / sending / closed are
 * states of one shape rather than separate leaves, and how `isSkeleton` mirrors the
 * loaded thread.
 *
 * @param props - {@link TicketThreadProps}
 */
const TicketThread = ({ subject, status, messages, replyValue, onReplyChange, onSendReply, isSending = false, isSkeleton = false, labels }: TicketThreadProps) => {
    const canSend = replyValue.trim().length > 0
    // While skeleton the composer shimmers regardless of status — there is no
    // resolved status to swap in a closed line yet.
    const isClosed = !isSkeleton && status === "closed"
    const bubbles = isSkeleton ? SKELETON_MESSAGES : messages

    return (
        <div data-tier="block" data-component="TicketThread">
            <SurfaceCard
                padding={3}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={4}
                        principle="label-field"
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={subject} />,
                                        () => <Chip tone={STATUS_TONE[status]} isSkeleton={isSkeleton} text={labels.statusOptions[status]} />,
                                    ]}
                                />
                            ),
                            () => (
                                <StackV
                                    gap={3}
                                    isSkeleton={isSkeleton}
                                    items={bubbles.map((message) => () => (
                                        <MessageBubble message={message} labels={labels} isSkeleton={isSkeleton} />
                                    ))}
                                />
                            ),
                            () =>
                                isClosed ? (
                                    <Typography size="sm" color="muted" align="center" text={labels.closedLabel} />
                                ) : (
                                    <StackV
                                        gap={2}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <InputTextarea
                                                    variant="secondary"
                                                    ariaLabel={labels.replyAriaLabel}
                                                    placeholder={labels.replyPlaceholder}
                                                    rows={3}
                                                    isSkeleton={isSkeleton}
                                                    value={replyValue}
                                                    onValueChange={onReplyChange}
                                                    isDisabled={isSending}
                                                />
                                            ),
                                            () => (
                                                <Button
                                                    variant="primary"
                                                    prefixIcon={PaperPlaneTiltIcon}
                                                    label={labels.sendLabel}
                                                    isSkeleton={isSkeleton}
                                                    onPress={isSkeleton ? undefined : onSendReply}
                                                    isDisabled={!canSend}
                                                    isPending={isSending}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { TicketThread }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "TicketThread" } as const
