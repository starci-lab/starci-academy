import { InputTextarea } from "@/components/atoms/forms"
import React, { useCallback, useState } from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { Button } from "@/components/atoms/buttons/Button"

import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { ScrollArea } from "@/components/frames/ScrollArea"
import { StackH, StackV } from "@/components/frames/Stack"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { UserCell } from "@/components/composites/lists/UserCell"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import type { ChatMessageNode } from "@/modules/api/graphql/queries/types/chat"

/** How many placeholder rows the co-located skeleton shows for the message list. */
const SKELETON_ROW_COUNT = 3

/** All display text, already localized by the connected `ChatPane`; a story passes i18n keys. */
export interface ChatPaneLabels {
    /** Empty-state title — no messages yet. */
    empty: string
    /** Error-state title — the message list failed to load. */
    error: string
    /** Retry-button label paired with {@link ChatPaneProps.onRetry}. */
    retry: string
    /** Composer placeholder / accessible name. */
    placeholder: string
    /** Send-button label. */
    send: string
}

/** Props for {@link _ChatPane} — presentational; all data resolved, no fetch/store/i18n. */
export interface ChatPaneProps {
    /** First load, nothing in hand → the message list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero messages → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch. */
    onRetry?: () => void
    /** Messages, oldest→newest, already resolved by the connected file. */
    messages?: Array<ChatMessageNode>
    /** `true` while a send is in flight — locks the send button and shows its spinner. */
    isSending?: boolean
    /** Sends the composed body; resolves `true` on success (the composer clears itself), `false` otherwise. */
    onSend: (body: string) => Promise<boolean>
    /** Already-translated copy — see {@link ChatPaneLabels}. */
    labels: ChatPaneLabels
}

/**
 * `_ChatPane` — the presentational half of {@link import(".").ChatPane}: one
 * chat conversation's message list + composer. Three states in the fixed
 * order error → empty → content (`loading-and-skeleton.md`): `error` falls
 * to the shared `AsyncContentError` frame, a settled `isEmpty` to
 * `AsyncContentEmpty`, and otherwise the message list renders with
 * `isSkeleton` threaded down to every leaf that supports it — placeholder
 * rows keep the SAME `ChatBubble` shape as the loaded state, alternating
 * `isMine` the way real messages do so the sender row shows/hides in the
 * same pattern. `UserCell` itself has no `isSkeleton`, so that one sender
 * row is mirrored in place with `Skeleton.UserCell` instead (still
 * co-located, not a parallel tree). Only the message-list zone branches —
 * the composer stays mounted underneath regardless, so a member can still
 * write while the history is loading or failed to load. See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch, the socket
 * subscription, and i18n.
 *
 * @param props - {@link ChatPaneProps}
 */
export const _ChatPane = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    messages = [],
    isSending = false,
    onSend,
    labels,
}: ChatPaneProps) => {
    const [body, setBody] = useState("")

    /** Trim + guard, hand off to the connected sender, clear the composer on success. */
    const onSendPress = useCallback(async () => {
        const trimmed = body.trim()
        if (!trimmed) {
            return
        }
        const ok = await onSend(trimmed)
        if (ok) {
            setBody("")
        }
    }, [body, onSend])

    // Row shape shared by both states: while shimmering, placeholder rows alternate
    // `isMine` the same way real messages do, so the sender row (UserCell) shows/hides
    // in the SAME pattern the loaded list will settle into — nothing collapses or jumps.
    const rows = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
            isMine: index % 2 === 1,
            body: undefined as string | undefined,
            author: undefined as ChatMessageNode["author"] | undefined,
            isFounderAuthor: false,
        }))
        : messages.map((message) => ({
            isMine: message.isMine,
            body: message.body as string | undefined,
            author: message.author as ChatMessageNode["author"] | undefined,
            isFounderAuthor: message.isFounderAuthor,
        }))

    const messageRows: Array<ComponentTypeWithSkeleton> = rows.map((row) => () => (
        <StackV gap={2} items={[
            ...(!row.isMine ? [() => (
                isSkeleton || !row.author ? (
                    <Skeleton.UserCell withHandle={false} />
                ) : (
                    <UserCell
                        username={row.author!.username}
                        displayName={row.author!.displayName ?? undefined}
                        avatar={row.author!.avatar ?? undefined}
                        size="sm"
                        trailing={row.isFounderAuthor
                            ? () => <SealCheckIcon weight="fill" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                            : undefined}
                    />
                )
            )] : []),
            () => (
                <ChatBubble role={row.isMine ? "user" : "assistant"}>
                    <Typography size="sm" text={row.body ?? ""} isSkeleton={isSkeleton} />
                </ChatBubble>
            ),
        ]} />
    ))

    return (
        <StackV
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            identity={{ tier: "block", component: "ChatPane" }}
            items={[
                () => (
                    error ? (
                        <AsyncContentError title={labels.error} onRetry={onRetry} retryLabel={labels.retry} />
                    ) : !isSkeleton && isEmpty ? (
                        <AsyncContentEmpty title={labels.empty} />
                    ) : (
                        // NEW-VOCABULARY GAP: no frame owns "cap this region's height and scroll
                        // it locally" — `ScrollArea`'s `classNames` is a closed, positioning-only
                        // enum (no height values) — so the height cap goes through `Box` (the
                        // sanctioned raw-appearance escape hatch), same shape as `FollowListModal`.
                        <Box className="max-h-[60vh]">
                            <ScrollArea axis="y" body={() => <StackV gap={4} isSkeleton={isSkeleton} items={messageRows} />} />
                        </Box>
                    )
                ),
                () => (
                    <StackV gap={3} principle="flex-action"
                        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                        items={[
                            () => (
                                <InputTextarea
                                    variant="secondary"
                                    rows={2}
                                    value={body}
                                    onValueChange={setBody}
                                    placeholder={labels.placeholder}
                                    ariaLabel={labels.placeholder}
                                />
                            ),
                            () => (
                                <StackH gap={1} principle="name-handle"
                                    explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                    justify="end" items={[
                                        () => (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                label={labels.send}
                                                isPending={isSending}
                                                isDisabled={!body.trim()}
                                                onPress={() => void onSendPress()}
                                            />
                                        ),
                                    ]} />
                            ),
                        ]} />
                ),
            ]}
        />
    )
}
