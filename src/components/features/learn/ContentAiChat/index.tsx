"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
    Button,
    Input,
    ScrollShadow,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useContentAiStream } from "@/hooks/socketio/useContentAiStream"
import { ChatBubble, type ChatRole } from "@/components/blocks/feed/ChatBubble"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"

/** Props for {@link ContentAiChat}. */
export type ContentAiChatProps = WithClassNames<undefined>

/** Generic starter questions shown in the empty chat (i18n keys under `contentAi.suggestions`). */
const SUGGESTION_KEYS = ["summarize", "hardest", "example", "remember"] as const

/** One turn in the (ephemeral, client-side) content-AI conversation. */
interface ChatMessage {
    /** Author of the turn. */
    role: ChatRole
    /** The message text (assistant content may be markdown). */
    content: string
}

/**
 * Content-AI chat thread + composer (the body of the ask-AI popover/drawer).
 * Keeps an ephemeral, client-side conversation about the content currently open
 * and replays the recent turns as short-term memory on each question. The answer
 * **streams** token-by-token over the `/content_ai` socket (free model only — no
 * AI credit). Resets when the active content changes.
 *
 * @param props - {@link ContentAiChatProps}
 */
export const ContentAiChat = ({ className }: ContentAiChatProps) => {
    const t = useTranslations()
    const contentId = useAppSelector((state) => state.content.id)
    const { ask, abort } = useContentAiStream()
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [input, setInput] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)

    // a new content opens a fresh conversation (and cancels any in-flight answer)
    useEffect(() => {
        abort()
        setMessages([])
        setInput("")
        setIsStreaming(false)
    }, [contentId, abort])

    /** Append a delta to the trailing assistant bubble as the answer streams in. */
    const appendToAssistant = useCallback((delta: string) => {
        setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + delta }
            }
            return next
        })
    }, [])

    /** Send a question (the arg, else the current input), replaying recent turns for memory. */
    const onSend = useCallback((preset?: string) => {
        const question = (preset ?? input).trim()
        if (!question || !contentId || isStreaming) {
            return
        }
        // prior turns become the history sent to the model
        const history = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }))
        // append the question + an empty assistant bubble the stream fills in
        setMessages((prev) => [
            ...prev,
            { role: "user", content: question },
            { role: "assistant", content: "" },
        ])
        setInput("")
        setIsStreaming(true)
        ask({
            contentId,
            question,
            history,
            onDelta: appendToAssistant,
            onDone: (error) => {
                setIsStreaming(false)
                if (!error) {
                    return
                }
                // surface the failure inline only when no answer streamed at all
                setMessages((prev) => {
                    const next = [...prev]
                    const last = next[next.length - 1]
                    if (last && last.role === "assistant" && last.content === "") {
                        next[next.length - 1] = { ...last, content: t("contentAi.error") }
                    }
                    return next
                })
            },
        })
    }, [input, contentId, messages, isStreaming, ask, appendToAssistant, t])

    return (
        <div className={cn("flex h-full flex-col gap-3", className)}>
            {/* thread */}
            <ScrollShadow hideScrollBar className="min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-3">
                    {messages.length === 0 ? (
                        // empty chat → hint + tappable starter questions (cheap "FAQ" v1)
                        <div className="flex flex-col gap-2">
                            <Typography type="body-sm" color="muted">
                                {t("contentAi.hint")}
                            </Typography>
                            {SUGGESTION_KEYS.map((key) => (
                                <Button
                                    key={key}
                                    variant="secondary"
                                    size="sm"
                                    className="justify-start text-start"
                                    onPress={() => onSend(t(`contentAi.suggestions.${key}`))}
                                >
                                    {t(`contentAi.suggestions.${key}`)}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <ChatBubble key={index} role={message.role}>
                                {message.role === "assistant" ? (
                                    // empty assistant bubble while waiting for the first token
                                    message.content === "" ? (
                                        <Typography type="body-sm" color="muted">
                                            {t("contentAi.thinking")}
                                        </Typography>
                                    ) : (
                                        <MarkdownContent markdown={message.content} />
                                    )
                                ) : (
                                    <Typography type="body-sm">
                                        {message.content}
                                    </Typography>
                                )}
                            </ChatBubble>
                        ))
                    )}
                </div>
            </ScrollShadow>

            {/* composer */}
            <div className="flex items-end gap-2">
                <TextField className="flex-1" variant="secondary">
                    <Input
                        aria-label={t("contentAi.placeholder")}
                        placeholder={t("contentAi.placeholder")}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                onSend()
                            }
                        }}
                    />
                </TextField>
                <Button
                    size="sm"
                    variant="primary"
                    isPending={isStreaming}
                    onPress={() => onSend()}
                >
                    {t("contentAi.send")}
                </Button>
            </div>
        </div>
    )
}
