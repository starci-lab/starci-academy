import React from "react"
import {
    StarciAi,
} from "@/components/features/learn/StarciAi"

/**
 * Route `/[locale]/courses/[courseId]/learn/starci-ai` — renders the StarCI AI
 * model overview for the active course.
 *
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <StarciAi />
}

export default Page
