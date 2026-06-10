import React from "react"
import {
    MindMap,
} from "@/components/layouts/mind-map"

/**
 * Route `/[locale]/courses/[courseId]/learn/mind-map` — renders the course
 * mind-map screen (breadcrumbs + title + interactive canvas).
 *
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <MindMap />
}

export default Page
