import React, { useEffect, useRef } from "react"
import { cn } from "@heroui/react"
import { ChatBubble } from "../ChatBubble/ChatBubble"
import { Composer } from "../Composer/Composer"
import type { ComposerProps } from "../Composer/Composer"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK ported faithfully from
 * `@/components/blocks/feed/ChatPanel`. Composed from the local blocks `ChatBubble`
 * (each turn) + `Composer` (sticky bottom). Synced to `src` later.
 */

/** One message rendered by {@link ChatPanel}. */
export interface ChatPanelMessage {
    /** Stable id — used as the React key. */
    id: string
    /** Author of the message — maps to the {@link ChatBubble} alignment + tint. */
    role: "user" | "assistant"
    /** Message body (text or a markdown render), rendered inside the bubble. */
    content: React.ReactNode
    /**
     * Optional tool-result row rendered below the bubble, assistant-aligned. The
     * caller builds it; the panel only places it.
     */
    toolResult?: React.ReactNode
}

/** Props for the {@link ChatPanel} block. */
export interface ChatPanelProps {
    /** The conversation, oldest first. Each entry renders one {@link ChatBubble}. */
    messages: Array<ChatPanelMessage>
    /** Props forwarded to the sticky-bottom {@link Composer} (controlled by the parent). */
    composer: ComposerProps
    /** When true, a three-dot typing indicator shows below the last message. */
    isTyping?: boolean
    /** Rendered centered in the list area when there are no messages. */
    emptyState?: React.ReactNode
    /** Tailwind height class for the whole panel. Defaults to a sensible `h-[32rem]`. */
    heightClassName?: string
    /** Extra classes merged onto the root. */
    className?: string
    /** When on, each part emits `data-anat-part` so a BlockAnatomy panel can badge it on-render. */
    showAnatomy?: boolean
}

/**
 * ChatPanel assembles the feed primitives into a complete chat surface: a
 * scrollable list of {@link ChatBubble}s (with optional tool-result rows interleaved
 * under assistant turns), an optional animated typing indicator, an empty-state slot
 * when the conversation is empty, and a sticky-bottom {@link Composer} for the next
 * message. The list auto-scrolls to the newest turn whenever the messages or typing
 * state change.
 *
 * @param props - {@link ChatPanelProps}
 */
export const ChatPanel = ({
    messages,
    composer,
    isTyping = false,
    emptyState,
    heightClassName = "h-[32rem]",
    className,
    showAnatomy = false,
}: ChatPanelProps) => {
    const listRef = useRef<HTMLDivElement>(null)

    // keep the newest turn in view as the conversation (or typing state) grows
    useEffect(() => {
        const element = listRef.current
        if (!element) {
            return
        }
        element.scrollTop = element.scrollHeight
    }, [messages, isTyping])

    const isEmpty = messages.length === 0

    return (
        <div
            className={cn(
                "flex flex-col overflow-hidden rounded-3xl border border-default bg-surface",
                heightClassName,
                className,
            )}
        >
            {/* scrollable message list */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4">
                {isEmpty ? (
                    <div
                        className="flex h-full items-center justify-center"
                        data-anat-part={showAnatomy ? "Empty state" : undefined}
                    >
                        {emptyState}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {messages.map((message) => (
                            <div key={message.id} className="flex flex-col gap-2">
                                <ChatBubble
                                    role={message.role}
                                    anatPart={showAnatomy ? "ChatBubble" : undefined}
                                >
                                    {message.content}
                                </ChatBubble>
                                {/* optional tool-result row, assistant-aligned under the bubble */}
                                {message.toolResult ? (
                                    <div className="flex justify-start">
                                        <div className="w-full max-w-[85%]">
                                            {message.toolResult}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}

                        {/* three-dot typing indicator on the assistant side */}
                        {isTyping ? (
                            <div className="flex justify-start">
                                <div
                                    className="flex items-center gap-1 rounded-2xl bg-surface-secondary px-3 py-3"
                                    data-anat-part={showAnatomy ? "Typing indicator" : undefined}
                                >
                                    {[0, 1, 2].map((dot) => (
                                        <span
                                            key={dot}
                                            className="size-1.5 animate-bounce rounded-full bg-muted"
                                            style={{ animationDelay: `${dot * 0.15}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {/* sticky-bottom composer */}
            <div className="border-t border-default p-3">
                <Composer
                    {...composer}
                    anatPart={showAnatomy ? "Composer" : undefined}
                    showAnatomy={showAnatomy}
                />
            </div>
        </div>
    )
}
