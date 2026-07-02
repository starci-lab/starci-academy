"use client"

import React from "react"
import { JobDetail } from "@/components/features/careers/Jobs/JobDetail"

/**
 * Route `/[locale]/jobs/[displayId]` — a single job posting's full detail +
 * apply CTA. The component reads `displayId` from the route itself.
 */
const Page = () => {
    return <JobDetail />
}

export default Page
