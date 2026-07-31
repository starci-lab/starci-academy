"use client"

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * Ported from `@/components/blocks/identity/SnippetIcon`.
 *
 * The trigger has no `className` hook into its internal icons — only the root
 * takes `className`/`classNames`.
 *
 * Renders a single fixed-size glyph (`w-5 h-5`, see `CopyIcon`/`CheckCircleIcon`
 * below), not text, so there is no `skeletonWidth` prop — nothing here scales
 * with content length, unlike a line of text.
 */

/** Props shared, excluding the `copyString`/`isSkeleton` pair — see {@link SnippetIconProps}. */
interface SnippetIconOwnProps {
    /**
     * Pins the copied state (the check glyph) from outside, for previews/stories.
     * Omitted, the atom manages this itself via `useState`/`setTimeout`. Passing
     * `true`/`false` overrides the internal state.
     */
    isCopied?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    className,
    classNames,
}: SnippetIconProps) => {
    const [copiedState, setCopiedState] = useState(false)
    // `isCopied` passed from outside wins over internal state (used for previews).
    const copied = isCopied ?? copiedState

    const handleCopy = async () => {
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
                className={cn("w-5 h-5 shrink-0 rounded-full", className, classNames)}
            />
        )
    }

    return (
        <motion.div
            onClick={handleCopy}
            className={cn("cursor-pointer", className, classNames)}
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
