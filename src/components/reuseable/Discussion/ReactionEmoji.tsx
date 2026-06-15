"use client"

import React from "react"
import { cn } from "@heroui/react"
import { FacebookEmoji } from "./FacebookEmoji"
import type { FacebookEmojiSize } from "./FacebookEmoji"
import type { ReactionDescriptor } from "./constants"
import type { WithClassNames } from "@/modules/types"

/** Props for {@link ReactionEmoji}. */
export interface ReactionEmojiProps extends WithClassNames<undefined> {
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
export const ReactionEmoji = ({ descriptor, size = "xs", className }: ReactionEmojiProps) => (
    <span className={cn("inline-flex", className)}>
        <FacebookEmoji type={descriptor.fbType} size={size} />
    </span>
)
