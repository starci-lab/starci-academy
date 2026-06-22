import React from "react"
import {
    AiSettings,
} from "@/components/features/profile"

/**
 * Route `/[locale]/profile/ai-settings` — renders the AI settings feature.
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <AiSettings />
}

export default Page
