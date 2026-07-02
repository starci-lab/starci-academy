import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Thin rain streaks falling fast, tilted, tinted by the accent color. */
export const RainEffect = ({ count = 45 }: { count?: number }) => {
    const particles = useSeededParticles(count, 23)
    return (
        <>
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-rain absolute top-0"
                    style={{
                        left: `${p.left}%`,
                        width: "1.5px",
                        height: `${16 + p.size * 4}px`,
                        background:
                            "linear-gradient(to bottom, transparent, var(--accent), transparent)",
                        animation: `rainFall ${1.4 + (p.duration % 4) / 3}s linear infinite ${p.delay / 2}s`,
                        opacity: 0,
                    }}
                />
            ))}
        </>
    )
}
