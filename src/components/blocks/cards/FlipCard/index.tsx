"use client"

import React from "react"
import { cn } from "@heroui/react"
import { motion } from "framer-motion"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link FlipCard} block. */
export interface FlipCardProps extends WithClassNames<undefined> {
    /** Whether the back (answer) face is currently shown. */
    revealed: boolean
    /** Toggle between the front and back faces (click / Enter / Space). */
    onToggle: () => void
    /** Accessible label for the flip toggle (e.g. "Show answer" / "Show question"). */
    ariaLabel: string
    /** Front (prompt) face content — composed by the caller. */
    front: ReactNode
    /** Back (answer) face content — composed by the caller. */
    back: ReactNode
}

/** Shared surface for both faces — a soft, borderless card (semantic tokens, no shadow). */
const FACE_CLASS = "flex min-h-64 flex-col gap-3 rounded-xl bg-default/40 p-8"
/** Keeps both faces stacked in the same grid cell + hides the away-facing side. */
const FACE_STYLE: React.CSSProperties = {
    gridArea: "1 / 1",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
}

/**
 * A two-faced flip card with a real 3D rotateY animation. Clicking (or pressing
 * Enter/Space) flips between the {@link FlipCardProps.front} prompt and the
 * {@link FlipCardProps.back} answer. A perspective wrapper gives depth; both faces
 * are stacked in one grid cell so the card sizes to the tallest face. Owns the
 * whole flip look so features just pass the two faces' content (per the
 * no-style-in-features rule). Used by the deck reviewer and the due-review session.
 *
 * @param props - {@link FlipCardProps}
 */
export const FlipCard = ({
    revealed,
    onToggle,
    ariaLabel,
    front,
    back,
    className,
}: FlipCardProps) => {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            onClick={onToggle}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onToggle()
                }
            }}
            className={cn("cursor-pointer select-none [perspective:1600px]", className)}
        >
            <motion.div
                initial={false}
                animate={{ rotateY: revealed ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="grid"
            >
                {/* front: prompt */}
                <div className={FACE_CLASS} style={FACE_STYLE}>
                    {front}
                </div>
                {/* back: answer, pre-rotated so it reads upright when flipped */}
                <div className={FACE_CLASS} style={{ ...FACE_STYLE, transform: "rotateY(180deg)" }}>
                    {back}
                </div>
            </motion.div>
        </div>
    )
}
