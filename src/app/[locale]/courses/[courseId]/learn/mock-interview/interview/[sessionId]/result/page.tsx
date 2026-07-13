"use client"

import React from "react"
import { useParams } from "next/navigation"
import { MockInterview } from "@/components/features/learn/MockInterview"

/**
 * Learn / mock-interview / interview / [sessionId] / result — the dedicated
 * RESULT URL for a GRADED mock-interview run, separate from the live
 * `.../interview/[sessionId]` route (2026-07-13). Mirrors the flashcard quiz
 * result route's own 2026-07-12 fix: whether a session is "done" is now
 * answered by the ROUTE itself instead of the `?phase=` query mirror
 * re-derived client-side (see `MockInterviewResult`'s doc for the root
 * cause it closes). `finishAndGrade` navigates here once grading succeeds;
 * resuming a session that turns out to already be graded also redirects
 * here instead of rendering the scorecard inline at the live URL.
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <MockInterview resultSessionId={sessionId} />
}

export default Page
