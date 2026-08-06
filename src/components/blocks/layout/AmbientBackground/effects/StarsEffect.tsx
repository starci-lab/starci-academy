import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Props for {@link StarsEffect}. */
interface StarsEffectProps {
    /** Particle count. */
    count?: number
}

/** A twinkling starfield scattered across the viewport, tinted by the accent color. Motion-free (opacity pulse only). */
export const StarsEffect = ({ count = 70 }: StarsEffectProps) => {
    const particles = useSeededParticles(count, 71)
    return (
        <>
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-star absolute rounded-full"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${Math.max(1, p.size - 2)}px`,
                        height: `${Math.max(1, p.size - 2)}px`,
                        background: "var(--accent)",
                        animation: `starTwinkle ${p.duration / 2 + 1.5}s ease-in-out infinite ${p.delay}s`,
                    }}
                />
            ))}
        </>
    )
}
