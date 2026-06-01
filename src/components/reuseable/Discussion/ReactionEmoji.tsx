"use client"

import React from "react"
import { cn } from "@heroui/react"
import { twemojiUrl } from "./constants"

/** Props for {@link ReactionEmoji}. */
export interface ReactionEmojiProps {
    /** Twemoji codepoint (filename without extension). */
    codepoint: string
    /** Native emoji used as the image alt text / fallback. */
    emoji: string
    /** Size + spacing classes (default `size-5`). */
    className?: string
}

/**
 * Renders a single reaction as a Twemoji SVG image so it looks identical (and Facebook-like)
 * on every OS, instead of the platform's native emoji font.
 * @param props - {@link ReactionEmojiProps}
 */
export const ReactionEmoji = ({ codepoint, emoji, className }: ReactionEmojiProps) => (
    <img
        src={twemojiUrl(codepoint)}
        alt={emoji}
        loading="lazy"
        draggable={false}
        className={cn("inline-block size-5 align-middle", className)}
    />
)
