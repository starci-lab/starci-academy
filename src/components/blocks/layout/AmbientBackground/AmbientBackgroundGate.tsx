"use client"

import React from "react"
import {
    useBackgroundEffect,
} from "@/hooks/effects/useBackgroundEffect"
import {
    AmbientBackground,
} from "./index"

/**
 * Connects {@link AmbientBackground} to the signed-in user's chosen effect
 * (Redux, hydrated once `me` resolves, with a same-device localStorage
 * fast-path in the meantime — see `useBackgroundEffect`). Kept as a thin
 * wrapper so `AmbientBackground` itself stays a pure presenter (no store
 * reads) and `InnerLayout` stays outside the Redux provider boundary.
 */
export const AmbientBackgroundGate = () => {
    const effect = useBackgroundEffect()
    return <AmbientBackground effect={effect} />
}
