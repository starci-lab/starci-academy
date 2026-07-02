import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Warm embers drifting upward from a glow pooled at the bottom edge (the app's original ambient look). */
export const EmberEffect = ({ count = 60 }: { count?: number }) => {
    const particles = useSeededParticles(count)
    return (
        <>
            <div
                className="absolute inset-x-0 bottom-0 h-2/3"
                style={{
                    background:
                        "radial-gradient(120% 80% at 50% 120%, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
                }}
            />
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-ember absolute bottom-0 rounded-full"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: "var(--accent)",
                        boxShadow: `0 0 ${p.size * 2}px var(--accent)`,
                        ["--drift" as string]: `${p.drift}px`,
                        animation: `emberRise ${p.duration}s linear infinite ${p.delay}s`,
                        opacity: 0,
                    }}
                />
            ))}
        </>
    )
}
