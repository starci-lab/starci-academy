"use client"

import React, { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const CONFETTI_PIECE_COUNT = 24
const CONFETTI_DURATION_MS = 2400
const CONFETTI_COLOR_CLASS = ["bg-accent", "bg-success", "bg-warning", "bg-danger"]

/** One falling piece's randomized flight. */
interface ConfettiPiece {
    key: number
    leftPercent: number
    delaySeconds: number
    durationSeconds: number
    rotateDegrees: number
    colorClass: string
}

/** Props for the internal {@link Confetti} effect. */
interface ConfettiProps {
    /** Bumping this replays the burst. */
    celebrateKey: number
}

/**
 * Fires a burst of falling particles every time `celebrateKey` changes (including
 * on first mount, since a fresh board can already open on a celebrated placement).
 * Self-clears after the flight so it never lingers as dead, invisible DOM.
 */
export const Confetti = ({ celebrateKey }: ConfettiProps) => {
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        setIsPlaying(true)
        const timer = window.setTimeout(() => setIsPlaying(false), CONFETTI_DURATION_MS)
        return () => window.clearTimeout(timer)
    }, [celebrateKey])

    const pieces = useMemo<Array<ConfettiPiece>>(
        () =>
            Array.from({ length: CONFETTI_PIECE_COUNT }, (_, index) => ({
                key: index,
                leftPercent: Math.random() * 100,
                delaySeconds: Math.random() * 0.4,
                durationSeconds: 1.6 + Math.random() * 0.8,
                rotateDegrees: Math.random() * 360,
                colorClass: CONFETTI_COLOR_CLASS[index % CONFETTI_COLOR_CLASS.length],
            })),
        [celebrateKey],
    )

    if (!isPlaying) {
        return null
    }

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {pieces.map((piece) => (
                    <motion.span
                        key={piece.key}
                        className={`absolute top-[-5%] size-2 rounded-sm ${piece.colorClass}`}
                        style={{ left: `${piece.leftPercent}%` }}
                        initial={{ y: "-10vh", opacity: 1, rotate: 0 }}
                        animate={{ y: "110vh", opacity: [1, 1, 0], rotate: piece.rotateDegrees }}
                        transition={{ duration: piece.durationSeconds, delay: piece.delaySeconds, ease: "easeIn" }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
