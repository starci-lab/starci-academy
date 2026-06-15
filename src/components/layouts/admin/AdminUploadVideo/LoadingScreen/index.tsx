"use client"

import React from "react"
import {
    Spinner,
} from "@heroui/react"

/**
 * Full-screen loading gate shown while the API key is being resolved.
 *
 * Presentational (render-only); "use client" because it relies on the HeroUI
 * Spinner client component.
 */
export const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    )
}
