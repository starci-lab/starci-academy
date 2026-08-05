"use client"

import React, {
    useEffect,
    useState,
} from "react"

/** Brand + celebratory palette for the falling pieces. */
const COLORS = ["#d6006e", "#eab308", "#16a34a", "#3b82f6", "#f97316", "#a855f7"]

/** Props for {@link Confetti}. */
export interface ConfettiProps {
    /**
     * Bump this to fire a burst (e.g. a counter incremented on a win). `0` stays
     * idle; each distinct non-zero value fires exactly one burst.
     */
    fireKey: number
    /** Piece count (default 90). */
    count?: number
}

/** One falling piece's randomised layout. */
interface Piece {
    id: string
    left: number
    delay: number
    duration: number
    color: string
    width: number
    rotate: number
}

/**
 * A lightweight, dependency-free confetti burst — a fixed, non-interactive overlay
 * that rains coloured pieces down the viewport once per `fireKey` change, then
 * clears itself. Pure CSS fall animation (no canvas, no library). Used to celebrate
 * a top-3 league finish when the viewer lands on a board where they've placed.
 *
 * @param props - {@link ConfettiProps}
 */
export const Confetti = ({
    fireKey,
    count = 90,
}: ConfettiProps) => {
    const [pieces, setPieces] = useState<Array<Piece>>([])

    useEffect(
        () => {
            if (!fireKey) {
                return
            }
            // randomise in the effect (client-only) so there is no SSR hydration drift
            const next: Array<Piece> = []
            for (let i = 0; i < count; i += 1) {
                next.push({
                    id: `${fireKey}-${i}`,
                    left: Math.random() * 100,
                    delay: Math.random() * 0.4,
                    duration: 2 + Math.random() * 1.5,
                    color: COLORS[i % COLORS.length],
                    width: 6 + Math.random() * 6,
                    rotate: Math.random() * 360,
                })
            }
            setPieces(next)
            const timer = window.setTimeout(() => setPieces([]), 4000)
            return () => window.clearTimeout(timer)
        },
        [fireKey, count],
    )

    if (pieces.length === 0) {
        return null
    }

    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <style>
                {"@keyframes starci-confetti-fall{0%{transform:translateY(-12vh) rotate(0deg);opacity:1}100%{transform:translateY(112vh) rotate(720deg);opacity:.85}}"}
            </style>
            {pieces.map((piece) => (
                <span
                    key={piece.id}
                    className="absolute top-0 rounded-[2px]"
                    style={{
                        left: `${piece.left}%`,
                        width: `${piece.width}px`,
                        height: `${piece.width * 0.6}px`,
                        backgroundColor: piece.color,
                        animation: `starci-confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
                    }}
                />
            ))}
        </div>
    )
}
