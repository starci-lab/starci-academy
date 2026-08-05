"use client"

import React from "react"
import { JobDetailPage } from "@/components/pages/JobDetailPage"

/**
 * Route `/[locale]/jobs/[displayId]` — a single job posting's full detail +
 * apply CTA. The component reads `displayId` from the route itself.
 */
const Page = () => {
    return <JobDetailPage />
}

export default Page
