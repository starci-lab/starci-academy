"use client"

import React from "react"
import { ScrollShadow, cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"

/** Props for the {@link FlipCard} block. */
export interface FlipCardProps extends WithClassNames<undefined> {
    /** Whether the answer card is currently revealed below the question. */
    revealed: boolean
    /** Label shown OUTSIDE (above) the question card — e.g. "Câu hỏi". */
    questionLabel: ReactNode
    /** Label shown OUTSIDE (above) the answer card — e.g. "Đáp án". */
    answerLabel: ReactNode
    /** Front (prompt) content — composed by the caller; sits in the question card. */
    front: ReactNode
    /** Back (answer) content — composed by the caller; shown once {@link revealed}. */
    back: ReactNode
}

/**
 * Anki-style "no-flip" prompt/answer pair: the question and the answer are TWO
 * SEPARATE {@link LabeledCard}s — each label ("Câu hỏi" / "Đáp án") sits OUTSIDE,
 * above its card (thầy 2026-07-12: "câu hỏi, đáp án ở ngoài kiểu labeled card"),
 * not an eyebrow inside the card. The answer card reveals below the question one
 * (height-animate) once {@link revealed}. Retrieval-practice research (thầy
 * 2026-07-11) says what matters for recall is committing to an answer BEFORE
 * seeing it — the caller owns the "Xem đáp án" reveal control and renders it
 * BETWEEN this block and the rating; this block is purely presentational.
 * @param props - {@link FlipCardProps}
 */
export const FlipCard = ({ revealed, questionLabel, answerLabel, front, back, className }: FlipCardProps) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <LabeledCard label={questionLabel} contentClassName="flex flex-col gap-3">
                {front}
            </LabeledCard>
            {/* answer = its OWN labeled card, revealed below (height-animate so the
                reveal still feels connected) */}
            <AnimatePresence initial={false}>
                {revealed ? (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <LabeledCard label={answerLabel}>
                            <ScrollShadow hideScrollBar className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto text-left">
                                {back}
                            </ScrollShadow>
                        </LabeledCard>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}
