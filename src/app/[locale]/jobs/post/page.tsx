"use client"

import React from "react"
import { JobPostForm } from "@/components/features/careers/Jobs/JobPostForm"

/**
 * Route `/[locale]/jobs/post` — the public job-submission form. Any signed-in
 * user can post an opening; it goes live immediately, no approval queue.
 */
const Page = () => {
    return <JobPostForm />
}

export default Page
