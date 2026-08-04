import { PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard, SurfaceCardNested } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ThreadDrawer` — overlay drawer over one conversation: message history by
 * author, plus an editable AI-drafted reply the operator reviews before
 * sending. New interaction vs. the legacy openclaw thread: the draft
 * composer is editable, and sending it is this drawer's own primary action.
 */

/** A channel the thread is running on. */
export type AgentOsChannelKind = "zalo" | "telegram" | "whatsapp"

/** Who sent one message in the thread. */
export type ThreadMessageAuthor = "customer" | "agent"

/** One message in the thread, oldest first. */
export interface ThreadDrawerMessage {
    /** Stable id. */
    id: string
    /** Who sent it — drives alignment + tone. */
    author: ThreadMessageAuthor
    /** Body text. */
    body: string
}

/** Props for {@link ThreadDrawer}. */
export interface ThreadDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The customer's display name — the drawer's own title. */
    customerName: string
    /** Which channel the thread is running on — shown under the title. */
    channel: AgentOsChannelKind
    /** The thread, oldest first. */
    messages: ReadonlyArray<ThreadDrawerMessage>
    /** The AI-drafted reply text (controlled) — editable before sending. */
    draftReply: string
    /** Fires as the draft composer changes. */
    onDraftReplyChange: (value: string) => void
    /** Send the (possibly edited) draft — the connected layer runs the mutation. */
    onSendDraft: () => void
    /** `true` → the send is in flight (send button busy, composer locks). */
    isSending?: boolean
    /**
     * `true` → the thread's own first fetch is in flight: the title, a fixed
     * count of message-shaped bubbles, and the draft composer all shimmer, and
     * the send is dropped. Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ThreadDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface ThreadDrawerLabels {
    /** The three channel labels, keyed by channel. */
    channelOptions: Record<AgentOsChannelKind, string>
    /** The two author labels, keyed by author (e.g. "Customer" / "Agent"). */
    authorOptions: Record<ThreadMessageAuthor, string>
    /** Heading on the draft-composer card. */
    draftLabel: string
    /** Small status chip on the draft card ("Not sent yet"). */
    draftPendingLabel: string
    /** Accessible name for the draft composer field. */
    draftAriaLabel: string
    /** Close button label. */
    closeLabel: string
    /** Send button label. */
    sendLabel: string
}

/** How many placeholder bubbles the loading mirror draws while `messages` hasn't landed yet. */
const SKELETON_BUBBLE_COUNT = 3

/** Placeholder messages — mixed authors so the shimmer mirrors the aligned loaded thread. */
const SKELETON_MESSAGES: ReadonlyArray<ThreadDrawerMessage> = Array.from(
    { length: SKELETON_BUBBLE_COUNT },
    (_unused, index): ThreadDrawerMessage => ({
        id: `skeleton-${index}`,
        author: index === 1 ? "agent" : "customer",
        body: "Thread message body placeholder text.",
    }),
)

/**
 * One message bubble — author label + body, aligned by author (the customer's
 * on the start, the agent's on the end). The SAME shape drives the loaded and
 * loading bubbles; `isSkeleton` threads down so a loading bubble is the loaded
 * bubble with its content nodes shimmering.
 */
const MessageBubble = ({ message, labels, isSkeleton }: {
    message: ThreadDrawerMessage
    labels: ThreadDrawerLabels
    isSkeleton: boolean
}) => (
    <StackH
        gap={3}
        justify={message.author === "agent" ? "end" : "start"}
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
                                        color={message.author === "agent" ? "accent" : "muted"}
                                        isSkeleton={isSkeleton}
                                        text={labels.authorOptions[message.author]}
                                    />
                                ),
                                () => <Typography size="sm" preserveWhitespace isSkeleton={isSkeleton} text={message.body} />,
                            ]}
                        />
                    )}
                />
            ),
        ]}
    />
)

/**
 * The thread drawer. See the file header for the read-history-then-draft
 * layout and why `isSkeleton` reaches every region.
 *
 * @param props - {@link ThreadDrawerProps}
 */
const ThreadDrawer = ({
    isOpen,
    onOpenChange,
    customerName,
    channel,
    messages,
    draftReply,
    onDraftReplyChange,
    onSendDraft,
    isSending = false,
    isSkeleton = false,
    labels,
}: ThreadDrawerProps) => {
    const bubbles = isSkeleton ? SKELETON_MESSAGES : messages
    const canSend = !isSkeleton && draftReply.trim().length > 0

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            title={customerName}
            description={labels.channelOptions[channel]}
            isSkeleton={isSkeleton}
            body={({ isSkeleton = false }: SkeletonProps) => (
                <StackV
                    gap={6}
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <StackV
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={bubbles.map((message) => () => (
                                    <MessageBubble message={message} labels={labels} isSkeleton={isSkeleton} />
                                ))}
                            />
                        ),
                        () => (
                            <SurfaceCardNested
                                title={labels.draftLabel}
                                meta={() => <Chip tone="default" text={labels.draftPendingLabel} />}
                                isSkeleton={isSkeleton}
                                body={({ isSkeleton }: SkeletonProps) => (
                                    <InputTextarea
                                        variant="secondary"
                                        ariaLabel={labels.draftAriaLabel}
                                        rows={4}
                                        value={draftReply}
                                        onValueChange={onDraftReplyChange}
                                        isDisabled={isSending}
                                        isSkeleton={isSkeleton}
                                    />
                                )}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <>
                    <Button variant="ghost" label={labels.closeLabel} onPress={() => onOpenChange(false)} isDisabled={isSending} />
                    <Button variant="primary" prefixIcon={PaperPlaneTiltIcon} label={labels.sendLabel} onPress={onSendDraft} isPending={isSending} isDisabled={!canSend} />
                </>
            )}
        />
    )
}

export { ThreadDrawer }
