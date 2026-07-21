"use client"

import { CheckCircleIcon, CopyIcon } from "@phosphor-icons/react"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/SnippetIcon`. Authored in Storybook (not `src`);
 * synced to `src` later. The shared `WithClassNames` base is inlined locally to
 * keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
    className?: string
}

/** Props for {@link SnippetIcon}. */
export interface SnippetIconProps extends WithClassNames<{
    copyIcon?: string
    checkIcon?: string
}> {
    /** The exact string written to the clipboard on click. */
    copyString: string
}

/**
 * One-tap copy affordance for a single line (an install command, an API key, a
 * short URL): a copy icon that swaps to a check for 350ms on click, confirming the
 * clipboard write, then returns to the copy icon. Place it next to the text to
 * copy — not inside a multi-line code block (there a separate Toast is needed).
 *
 * @param props - {@link SnippetIconProps}
 */
export const SnippetIcon = ({ copyString, classNames = {}, className }: SnippetIconProps) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(copyString)
        setCopied(true)
        setTimeout(() => setCopied(false), 350)
    }

    return (
        <motion.div
            onClick={handleCopy}
            className={cn("cursor-pointer", className)}
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
                        <CheckCircleIcon className={cn(classNames.checkIcon, "w-5 h-5")} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                        <CopyIcon className={cn(classNames.copyIcon, "w-5 h-5")} />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
