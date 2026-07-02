import React from "react"
import {
    useSeededParticles,
} from "../useSeededParticles"

/** Hollow bubbles rising from the bottom edge with a gentle wobble, tinted by the accent color. */
export const BubblesEffect = ({ count = 30 }: { count?: number }) => {
    const particles = useSeededParticles(count, 37)
    return (
        <>
            <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{
                    background:
                        "radial-gradient(120% 80% at 50% 120%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 70%)",
                }}
            />
            {particles.map((p) => (
                <span
                    key={p.index}
                    className="ambient-bubble absolute bottom-0 rounded-full"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size * 2}px`,
                        height: `${p.size * 2}px`,
                        border: "1.5px solid color-mix(in oklch, var(--accent) 70%, transparent)",
                        background: "color-mix(in oklch, var(--accent) 12%, transparent)",
                        ["--drift" as string]: `${p.drift}px`,
                        animation: `bubbleRise ${p.duration + 3}s ease-in infinite ${p.delay}s`,
                        opacity: 0,
                    }}
                />
            ))}
        </>
    )
}
