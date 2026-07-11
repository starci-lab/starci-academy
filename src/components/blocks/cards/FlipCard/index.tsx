"use client"

import React from "react"
import { ScrollShadow, cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link FlipCard} block. */
export interface FlipCardProps extends WithClassNames<undefined> {
    /** Whether the answer is currently expanded below the question. */
    revealed: boolean
    /** Front (prompt) content — composed by the caller; centered in the card. */
    front: ReactNode
    /** Back (answer) content — composed by the caller; shown once {@link revealed}. */
    back: ReactNode
}

/**
 * Anki-style "no-flip" prompt/answer card: the question sits on one plane and the
 * answer expands directly below it (dashed divider + a light success wash) instead
 * of a 3D flip. Retrieval-practice research (thầy 2026-07-11, see prototype notes
 * `.claude/fe/prototypes/flashcard-review-session-flow.html` màn 1a) says the thing
 * that matters for recall is committing to an answer BEFORE seeing it — not the
 * flip animation itself; a plain "Xem đáp án" reveal (Anki's own pattern) covers
 * that without the extra 3D-transform complexity. The caller owns the actual
 * reveal control (an outside "Xem đáp án"/"Ẩn đáp án" button, per the
 * `card-in-card` §5 rule: a card with a real action button stays static, not
 * whole-card-clickable) — this block is purely presentational, driven by
 * {@link FlipCardProps.revealed}.
 * @param props - {@link FlipCardProps}
 */
export const FlipCard = ({ revealed, front, back, className }: FlipCardProps) => {
    return (
        <div className={cn("overflow-hidden rounded-2xl bg-surface shadow-surface", className)}>
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center sm:min-h-72">
                {front}
            </div>
            <AnimatePresence initial={false}>
                {revealed ? (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-dashed border-default bg-success/5"
                    >
                        <ScrollShadow hideScrollBar className="flex max-h-96 flex-col gap-3 p-6 text-left">
                            {back}
                        </ScrollShadow>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}
