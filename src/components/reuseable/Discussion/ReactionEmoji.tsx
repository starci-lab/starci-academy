"use client"

import React from "react"
import { cn } from "@heroui/react"
import type { ReactionDescriptor } from "./constants"
import type { WithClassNames } from "@/modules/types"

/** Visual size for {@link ReactionEmoji}. */
export type ReactionEmojiSize = "xs" | "sm" | "md" | "lg"

/** Size token → emoji glyph text size. */
const SIZE_CLASS: Record<ReactionEmojiSize, string> = {
    xs: "text-base",
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
}

/** Props for {@link ReactionEmoji}. */
export interface ReactionEmojiProps extends WithClassNames<undefined> {
    /** Descriptor for the reaction (provides the native `emoji` glyph). */
    descriptor: ReactionDescriptor
    /** Visual size (default `"xs"` for inline use; `"sm"` for the picker). */
    size?: ReactionEmojiSize
}

/**
 * Renders a single reaction as a PLAIN native emoji glyph (👍 ❤️ 😂 …) — no sprite/animation
 * library. Decorative (`aria-hidden`); the accessible label comes from the surrounding control.
 * @param props - {@link ReactionEmojiProps}
 */
export const ReactionEmoji = ({ descriptor, size = "xs", className }: ReactionEmojiProps) => (
    <span aria-hidden className={cn("inline-flex leading-none", SIZE_CLASS[size], className)}>
        {descriptor.emoji}
    </span>
)
