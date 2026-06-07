"use client"

import React from "react"
import { FacebookEmoji } from "./FacebookEmoji"
import type { FacebookEmojiSize } from "./FacebookEmoji"
import type { ReactionDescriptor } from "./constants"

/** Props for {@link ReactionEmoji}. */
export interface ReactionEmojiProps {
    /** Descriptor for the reaction (provides `fbType` for the emoji and `emoji` for a11y). */
    descriptor: ReactionDescriptor
    /**
     * Visual size passed to {@link FacebookEmoji}.
     * Defaults to `"xs"` for compact inline use; use `"sm"` for the picker.
     */
    size?: FacebookEmojiSize
}

/**
 * Renders a single Facebook-style animated reaction emoji.
 * Uses the self-contained {@link FacebookEmoji} component (pure CSS, no external assets).
 * @param props - {@link ReactionEmojiProps}
 */
export const ReactionEmoji = ({ descriptor, size = "xs" }: ReactionEmojiProps) => (
    <FacebookEmoji type={descriptor.fbType} size={size} />
)
