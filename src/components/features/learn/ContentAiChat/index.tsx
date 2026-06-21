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
import { PaperPlaneRightIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useMutateAskContentAiSwr } from "@/hooks"
import { useGraphQLWithToast } from "@/modules/toast"
import { ChatBubble, type ChatRole } from "@/components/blocks"
import { MarkdownContent } from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

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
 * Content-AI chat thread + composer (the body of the ask-AI drawer). Keeps an
 * ephemeral, client-side conversation about the content currently open and sends
 * the recent turns back as short-term memory on each `askContentAi` call. Resets
 * when the active content changes. Each question spends one AI credit server-side.
 *
 * @param props - {@link ContentAiChatProps}
 */
export const ContentAiChat = ({ className }: ContentAiChatProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const contentId = useAppSelector((state) => state.content.id)
    const askSwr = useMutateAskContentAiSwr()
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [input, setInput] = useState("")

    // a new content opens a fresh conversation
    useEffect(() => {
        setMessages([])
        setInput("")
    }, [contentId])

    /** Send a question (the arg, else the current input), replaying recent turns for memory. */
    const onSend = useCallback(async (preset?: string) => {
        const question = (preset ?? input).trim()
        if (!question || !contentId || askSwr.isMutating) {
            return
        }
        // prior turns become the history sent to the model
        const history = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }))
        setMessages((prev) => [...prev, { role: "user", content: question }])
        setInput("")
        let answer: string | null = null
        const ok = await runGraphQL(
            async () => {
                const envelope = await askSwr.trigger({ contentId, question, history })
                if (!envelope?.success || !envelope.data) {
                    throw new Error(envelope?.message ?? "Ask failed")
                }
                answer = envelope.data.answer
                return envelope
            },
            { showSuccessToast: false },
        )
        if (ok && answer) {
            setMessages((prev) => [...prev, { role: "assistant", content: answer as string }])
        }
    }, [input, contentId, messages, runGraphQL, askSwr])

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
                                    <MarkdownContent markdown={message.content} />
                                ) : (
                                    <Typography type="body-sm">
                                        {message.content}
                                    </Typography>
                                )}
                            </ChatBubble>
                        ))
                    )}
                    {askSwr.isMutating ? (
                        <ChatBubble role="assistant">
                            <Typography type="body-sm" color="muted">
                                {t("contentAi.thinking")}
                            </Typography>
                        </ChatBubble>
                    ) : null}
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
                                void onSend()
                            }
                        }}
                    />
                </TextField>
                <Button
                    size="sm"
                    variant="primary"
                    isPending={askSwr.isMutating}
                    onPress={() => void onSend()}
                >
                    <PaperPlaneRightIcon aria-hidden focusable="false" className="size-5" />
                    {t("contentAi.send")}
                </Button>
            </div>
        </div>
    )
}
