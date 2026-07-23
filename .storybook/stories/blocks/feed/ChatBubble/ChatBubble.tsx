import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feed/ChatBubble`. A single tinted, aligned wrapper — closer
 * to a PRIMITIVE than a composite. Synced to `src` later.
 */

/** Who authored a chat message. */
export type ChatRole = "user" | "assistant"

/** Props for the {@link ChatBubble} block. */
export interface ChatBubbleProps {
    /** Author of the message — drives alignment + tint. */
    role: ChatRole
    /** Message content (text or a markdown render). */
    children: ReactNode
    /** Extra classes merged onto the row. */
    className?: string
    /** When on, emit `data-anat-part` markers for the anatomy overlay. */
    showAnatomy?: boolean
}

/**
 * A single chat message bubble: user messages align right with an accent tint,
 * assistant messages align left on the surface tint. Pure + props-only; owns its
 * look so chat features only compose it.
 *
 * @param props - {@link ChatBubbleProps}
 */
export const ChatBubble = ({ role, children, className, showAnatomy }: ChatBubbleProps) => {
    const isUser = role === "user"
    return (
        <div
            className={cn("flex", isUser ? "justify-end" : "justify-start", className)}
            data-anat-part={showAnatomy ? "div · row" : undefined}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2",
                    isUser ? "bg-accent-soft" : "bg-surface-secondary",
                )}
                data-anat-part={showAnatomy ? "div · bubble" : undefined}
            >
                {children}
            </div>
        </div>
    )
}
