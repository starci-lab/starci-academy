"use client"

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * ATOM — `SnippetIcon`: the system's one single-click copy affordance.
 *
 * 1 PROP = 1 LEAF. `copyString` is required but produces no visual difference — every
 * value renders the same copy glyph, only the clipboard content changes — so it gets no
 * leaf. `className` gets no leaf. The one prop with a shape is `isCopied`, which pins the
 * ✓ glyph from the outside.
 *
 * Leaf set: `Default` (idle) + `Copied` (prop `isCopied`). The atom exposes `showAnatomy`
 * so both leaves can carry an anatomy badge.
 */

/** Props shared, excluding the `copyString`/`isSkeleton` pair — see {@link SnippetIconProps}. */
interface SnippetIconOwnProps {
    /**
     * Pins the copied state (the check glyph) from outside, for previews/stories.
     * Omitted, the atom manages this itself via `useState`/`setTimeout`. Passing
     * `true`/`false` overrides the internal state.
     */
    isCopied?: boolean
}

/**
 * `copyString` is required to render the live trigger, optional when
 * `isSkeleton` — the shimmer has nothing to copy.
 */
export type SnippetIconProps = SnippetIconOwnProps &
    (
        | {
            /** `true` → renders a shimmer at the exact glyph size, in place of the trigger. */
            isSkeleton: true
            /** The exact string written to the clipboard on click. */
            copyString?: string
        }
        | {
            isSkeleton?: false
            /** The exact string written to the clipboard on click. */
            copyString: string
        }
    )

/**
 * One-tap copy affordance for a single line (an install command, an API key, a
 * short URL): a copy icon that swaps to a check for 350ms on click, confirming the
 * clipboard write, then returns to the copy icon. Place it next to the text to
 * copy — not inside a multi-line code block (there a separate Toast is needed).
 *
 * @param props - {@link SnippetIconProps}
 */
const SnippetIconBase = ({
    copyString,
    isCopied,
    isSkeleton = false,
    
}: SnippetIconProps) => {
    const [copiedState, setCopiedState] = useState(false)
    // `isCopied` passed from outside wins over internal state (used for previews).
    const copied = isCopied ?? copiedState

    const onCopy = async () => {
        // `copyString` is `string | undefined` here because it's optional in the
        // `isSkeleton` branch of the union — a skeleton is never clicked, but the
        // guard also keeps this call type-safe without narrowing on `isSkeleton`.
        if (!copyString) return
        await navigator.clipboard.writeText(copyString)
        setCopiedState(true)
        setTimeout(() => setCopiedState(false), 350)
    }

    if (isSkeleton) {
        // The trigger has no visible box of its own — it IS the glyph — so the
        // shimmer takes the glyph's exact footprint (`w-5 h-5`, same as
        // `CopyIcon`/`CheckCircleIcon` below) at the trigger's own position.
        // `rounded-full` matches the sibling bare size-5 glyph skeletons elsewhere
        // in this atom set (`Menu`'s row icon, `StepBadge`'s check).
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="SnippetIcon"
                className={cn("w-5 h-5 shrink-0 rounded-full")}

            />
        )
    }

    return (
        // The root IS the SnippetIcon atom, so it hard-codes its own name.
        // `Icon` is the inner glyph swap and gets its own self-badge below.
        <motion.div
            data-tier="atom"
            data-component="SnippetIcon"
            onClick={onCopy}
            className={cn("cursor-pointer")}
            whileTap={{ scale: 0.9 }}

        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.span
                        key="check"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}

                    >
                        <CheckCircleIcon className="w-5 h-5" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}

                    >
                        <CopyIcon className="w-5 h-5" />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

/** `SnippetIcon.*` — one-tap copy affordance namespace. */
export { SnippetIconBase as SnippetIcon }

/** Tier metadata for `SnippetIcon`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "SnippetIcon" } as const
