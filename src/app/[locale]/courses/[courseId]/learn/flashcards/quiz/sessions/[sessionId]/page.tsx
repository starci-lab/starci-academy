"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / quiz / sessions / [sessionId] — the dedicated, resumable
 * URL for an in-progress "Hỏi nhanh" run. `startFlashcardQuizSession` records
 * this id server-side right after drawing a session; returning to it later
 * (within its 24h TTL) resumes the persisted progress instead of starting
 * fresh. Threads the route's `sessionId` down as `resumeSessionId` so
 * {@link Flashcards} (and, further down, `QuizSession`) knows to rehydrate
 * rather than show the setup screen. Mirrors
 * `learn/mock-interview/interview/[sessionId]`.
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <Flashcards resumeQuizSessionId={sessionId} />
}

export default Page
