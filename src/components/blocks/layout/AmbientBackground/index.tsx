"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    BackgroundEffect,
} from "@/modules/types/enums/background-effect"
import {
    EmberEffect,
} from "./effects/EmberEffect"
import {
    WaveEffect,
} from "./effects/WaveEffect"
import {
    SnowEffect,
} from "./effects/SnowEffect"
import {
    RainEffect,
} from "./effects/RainEffect"
import {
    BubblesEffect,
} from "./effects/BubblesEffect"
import {
    FirefliesEffect,
} from "./effects/FirefliesEffect"
import {
    StarsEffect,
} from "./effects/StarsEffect"
import {
    AuroraEffect,
} from "./effects/AuroraEffect"
import {
    CircuitEffect,
} from "./effects/CircuitEffect"

/** Props for {@link AmbientBackground}. */
export interface AmbientBackgroundProps extends WithClassNames<undefined> {
    /** Which ambient effect to render (user's Settings → "Giao diện" choice). Defaults to `None`. */
    effect?: BackgroundEffect
}

/**
 * App-wide ambient background — one of several decorative effects (Settings →
 * "Giao diện") sitting `fixed inset-0` behind everything (negative z-index,
 * non-interactive) so it stays put while the page scrolls. Every effect tints
 * from the `--accent` token, so it tracks the user's chosen accent color
 * automatically; the caller hides this entirely on `/learn` (reading column
 * stays uncluttered) and honours `prefers-reduced-motion` per-effect in
 * `globals.css`.
 *
 * Pure presenter: owns all of its style, takes no store/data beyond the
 * `effect` prop. Each effect's particle layout is seeded deterministically
 * (see `useSeededParticles`) so server + client markup match — no hydration
 * mismatch and no `Math.random` at render.
 *
 * @param props - optional className (placement) + which `effect` to render.
 */
export const AmbientBackground = ({
    className,
    effect = BackgroundEffect.None,
}: AmbientBackgroundProps) => {
    if (effect === BackgroundEffect.None) {
        return null
    }

    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
                className,
            )}
        >
            {effect === BackgroundEffect.Ember ? <EmberEffect /> : null}
            {effect === BackgroundEffect.Wave ? <WaveEffect /> : null}
            {effect === BackgroundEffect.Snow ? <SnowEffect /> : null}
            {effect === BackgroundEffect.Rain ? <RainEffect /> : null}
            {effect === BackgroundEffect.Bubbles ? <BubblesEffect /> : null}
            {effect === BackgroundEffect.Fireflies ? <FirefliesEffect /> : null}
            {effect === BackgroundEffect.Stars ? <StarsEffect /> : null}
            {effect === BackgroundEffect.Aurora ? <AuroraEffect /> : null}
            {effect === BackgroundEffect.Circuit ? <CircuitEffect /> : null}
        </div>
    )
}
