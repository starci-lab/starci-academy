"use client"

import React from "react"
import { useParams } from "next/navigation"
import { MockInterviewPage } from "@/components/pages/MockInterviewPage"

/**
 * Learn / mock-interview / interview / [sessionId] — the dedicated, resumable
 * URL for a LIVE mock-interview run (full-bleed work surface, same as
 * `?phase=interview` used to be). `startMockInterviewSession` navigates here
 * right after drawing a session; returning to it later (within its 24h TTL)
 * resumes the server-persisted transcript instead of starting fresh. Threads
 * the route's `sessionId` down as `resumeSessionId` so {@link MockInterviewPage}
 * (and, further down, `MockInterviewSession`) knows to rehydrate rather than
 * show the green room.
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <MockInterviewPage resumeSessionId={sessionId} />
}

export default Page
