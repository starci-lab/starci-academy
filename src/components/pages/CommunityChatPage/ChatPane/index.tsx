"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { _ChatPane } from "./component"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { SubscriptionEvent } from "@/hooks/socketio/enums/subscription-event"
import { communityChatSocketIoEventEmitter } from "@/hooks/socketio/useCommunityChatSocketIoLifecycle"
import { useCommunityChatSocketIo } from "@/hooks/socketio/useCommunityChatSocketIo"
import { useMutateSendChatMessageSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSendChatMessageSwr"
import { useQueryChatMessagesSwr } from "@/hooks/swr/api/graphql/queries/useQueryChatMessagesSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/** Props for {@link ChatPane}. */
export interface ChatPaneProps {
    /**
     * Conversation whose messages are shown + sent to. Omitted/null → shimmer
     * mirror of the pane (message list + composer) while the active id resolves.
     */
    conversationId?: string | null
}

type ChatPaneLiveProps = {
    conversationId: string
}

/**
 * Live connected pane — hooks only run when a conversation id is known.
 */
const ChatPaneLive = ({ conversationId }: ChatPaneLiveProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const socket = useCommunityChatSocketIo()

    const { data, isLoading, error, mutate } = useQueryChatMessagesSwr(conversationId)
    const { trigger: sendMessage, isMutating } = useMutateSendChatMessageSwr()

    // server returns newest-first; render oldest→newest so the latest sits at the bottom
    const messages = useMemo(
        () => [...(data?.items ?? [])].reverse(),
        [data],
    )

    // join the conversation room (and re-join on reconnect)
    useEffect(() => {
        const subscribe = () => {
            socket.emit(PublicationEvent.SubscribeCommunityChat, {
                data: {
                    conversationId,
                },
            })
        }
        if (socket.connected) {
            subscribe()
        }
        socket.on("connect", subscribe)
        return () => {
            socket.off("connect", subscribe)
        }
    }, [socket, conversationId])

    // refetch whenever a realtime message arrives for THIS conversation
    useEffect(() => {
        const handler = (message: { data?: { conversationId?: string } }) => {
            // ignore events for other conversations sharing the same socket
            if (message?.data?.conversationId !== conversationId) {
                return
            }
            void mutate()
        }
        communityChatSocketIoEventEmitter.on(SubscriptionEvent.ChatMessageCreated, handler)
        return () => {
            communityChatSocketIoEventEmitter.off(SubscriptionEvent.ChatMessageCreated, handler)
        }
    }, [conversationId, mutate])

    /** Send one message (toast-wrapped), then refresh the list on success. */
    const onSend = useCallback(async (trimmedBody: string) => {
        const ok = await runGraphQL(async () => {
            const result = await sendMessage({
                conversationId,
                body: trimmedBody,
            })
            return result.data!.sendChatMessage
        })
        if (ok) {
            await mutate()
        }
        return ok
    }, [conversationId, sendMessage, runGraphQL, mutate])

    return (
        <_ChatPane
            // first load, nothing in hand → shimmer (loading-and-skeleton.md)
            isSkeleton={isLoading && messages.length === 0}
            isEmpty={messages.length === 0}
            // only a settled fetch error with nothing cached to show reaches the block
            error={messages.length === 0 ? error : undefined}
            onRetry={() => void mutate()}
            messages={messages}
            isSending={isMutating}
            onSend={onSend}
            labels={{
                empty: t("community.chat.empty"),
                error: t("community.chat.error"),
                retry: t("community.retry"),
                placeholder: t("community.chat.placeholder"),
                send: t("community.chat.send"),
            }}
        />
    )
}

/**
 * `ChatPane` — the connected half (see `tiers/split.md`) of one chat
 * conversation pane: fetches the conversation's messages, joins its
 * Socket.IO room and refetches on every new message (so messages from
 * others appear in real time), and resolves every label before handing
 * them to the presentational {@link _ChatPane}.
 *
 * @param props - {@link ChatPaneProps}
 */
export const ChatPane = ({ conversationId }: ChatPaneProps) => {
    const t = useTranslations()

    // Wait for an active conversation id — same shape as the live pane via
    // intrinsic `isSkeleton` (no parallel public skeleton export).
    if (!conversationId) {
        return (
            <_ChatPane
                isSkeleton
                isEmpty={false}
                messages={[]}
                isSending={false}
                onSend={async () => false}
                labels={{
                    empty: t("community.chat.empty"),
                    error: t("community.chat.error"),
                    retry: t("community.retry"),
                    placeholder: t("community.chat.placeholder"),
                    send: t("community.chat.send"),
                }}
            />
        )
    }
    return <ChatPaneLive conversationId={conversationId} />
}
