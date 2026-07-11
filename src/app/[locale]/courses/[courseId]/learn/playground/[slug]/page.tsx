"use client"

import React from "react"
import { PlaygroundSession } from "@/components/features/learn/Playground/PlaygroundSession"

/**
 * Learn / playground / [slug] — the full-bleed 2-pane hands-on work surface
 * for one Docker/K8s exercise. `PlaygroundSession` reads the slug from the
 * route itself. The learn layout drops the course rails + reading padding
 * for this route (see `isPlaygroundSession` in `learn/layout.tsx`).
 */
const Page = () => {
    return <PlaygroundSession />
}

export default Page
