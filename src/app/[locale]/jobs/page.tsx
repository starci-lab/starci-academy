"use client"

import React from "react"
import { JobList } from "@/components/features/careers/Jobs/JobList"

/**
 * Route `/[locale]/jobs` — the public IT job board: search + filter over
 * structured postings from partner companies.
 */
const Page = () => {
    return <JobList />
}

export default Page
