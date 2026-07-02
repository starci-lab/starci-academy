import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Slow-drifting fireflies scattered across the viewport that flicker in and out, tinted by the accent color. */
export const FirefliesEffect = ({ count = 24 }: { count?: number }) => {
    const particles = useSeededParticles(count, 53)
    return (
        <>
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-firefly absolute rounded-full"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: "var(--accent)",
                        boxShadow: `0 0 ${p.size * 2.5}px var(--accent)`,
                        ["--drift" as string]: `${p.drift}px`,
                        animation: `fireflyDrift ${p.duration + 2}s ease-in-out infinite ${p.delay}s`,
                    }}
                />
            ))}
        </>
    )
}
