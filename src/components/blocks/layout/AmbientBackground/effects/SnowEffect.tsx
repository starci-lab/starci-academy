import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Snowflakes drifting straight down with a light horizontal wander, tinted by the accent color. */
export const SnowEffect = ({ count = 50 }: { count?: number }) => {
    const particles = useSeededParticles(count, 11)
    return (
        <>
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-snow absolute top-0 rounded-full"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: "color-mix(in oklch, var(--accent) 70%, white)",
                        ["--drift" as string]: `${p.drift}px`,
                        animation: `snowFall ${p.duration + 4}s linear infinite ${p.delay}s`,
                        opacity: 0,
                    }}
                />
            ))}
        </>
    )
}
