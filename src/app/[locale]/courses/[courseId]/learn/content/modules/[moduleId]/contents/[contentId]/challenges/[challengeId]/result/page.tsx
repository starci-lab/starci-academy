"use client"

import React from "react"
import { ChallengeResultPage } from "@/components/pages/ChallengeResultPage"

/**
 * Route `…/challenges/[challengeId]/result` — the dedicated challenge grading result
 * page (replaces the old drawer → modal stack). Reads `?submission=<requirementId>`
 * + `?attempt=<id>`. Thin route file: mounts the feature, no logic here.
 */
const Page = () => {
    return (
        <ChallengeResultPage />
    )
}

export default Page
