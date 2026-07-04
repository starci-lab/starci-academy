"use client"

import React from "react"
import { MockInterview } from "@/components/features/learn/MockInterview"

/**
 * Learn / mock-interview: a phase-scaffolded mock interview over the course
 * (voice-first, AI-graded per phase). Enrolled-only — the feature gates the
 * surface behind enrollment internally.
 */
const Page = () => {
    return <MockInterview />
}

export default Page
