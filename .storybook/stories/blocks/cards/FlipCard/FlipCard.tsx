import React, { useState } from "react"
import { ScrollShadow, cn } from "@heroui/react"
import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
// LabeledCard is superseded by SurfaceCard (label OUTSIDE the card + bordered +
// contentClassName) — the local SurfaceCard port stands in for the question /
// answer frames faithfully.
import { SurfaceCard } from "../SurfaceCard/SurfaceCard"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/cards/FlipCard`. Authored in Storybook (not `src`);
 * synced back to `src` later.
 */

/** Props for the {@link FlipCard} block. */
export interface FlipCardProps {
    /** Whether the answer card is currently revealed below the question. */
    revealed: boolean
    /** Label shown OUTSIDE (above) the question card — e.g. "Câu hỏi". */
    questionLabel: ReactNode
    /** Label shown OUTSIDE (above) the answer card — e.g. "Đáp án". */
    answerLabel: ReactNode
    /** Front (prompt) content — composed by the caller; sits in the question card. */
    front: ReactNode
    /**
     * Optional content rendered DIRECTLY under the question card (grouped with it,
     * `gap-3`) — ABOVE the answer, so it stays anchored to the question when the
     * answer reveals below. Used for the card's level/tag chips.
     */
    belowFront?: ReactNode
    /** Back (answer) content — composed by the caller; shown once {@link revealed}. */
    back: ReactNode
    /** Extra classes on the wrapper. */
    className?: string
}

/**
 * Anki-style "no-flip" prompt/answer pair: the question and the answer are TWO
 * SEPARATE labeled cards — each label ("Câu hỏi" / "Đáp án") sits OUTSIDE, above
 * its card, not an eyebrow inside the card. The answer card reveals below the
 * question one (height-animate) once {@link revealed}. Purely presentational —
 * the caller owns the "Xem đáp án" reveal control.
 *
 * @param props - {@link FlipCardProps}
 */
export const FlipCard = ({ revealed, questionLabel, answerLabel, front, belowFront, back, className }: FlipCardProps) => {
    // `overflow-hidden` is only needed WHILE the height animates — left on at rest
    // it permanently clips the answer card's own box-shadow. Drop it once the
    // reveal settles so the shadow shows in full, same as the question card.
    const [animating, setAnimating] = useState(false)
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* question card + its `belowFront` chips grouped `gap-3` — the chips
                stay under the QUESTION when the answer reveals below. */}
            <div className="flex flex-col gap-3">
                <SurfaceCard label={questionLabel} bordered contentClassName="flex flex-col gap-3">
                    {front}
                </SurfaceCard>
                {belowFront}
            </div>
            {/* answer = its OWN labeled card, revealed below (height-animate). */}
            <AnimatePresence initial={false}>
                {revealed ? (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        onAnimationStart={() => setAnimating(true)}
                        onAnimationComplete={() => setAnimating(false)}
                        className={cn(animating && "overflow-hidden")}
                    >
                        <SurfaceCard label={answerLabel} bordered>
                            <ScrollShadow hideScrollBar className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto text-left">
                                {back}
                            </ScrollShadow>
                        </SurfaceCard>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}
