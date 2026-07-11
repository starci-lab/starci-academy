"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / review / decks / [deckId] / sessions / [sessionId] —
 * the dedicated, resumable URL for an in-progress "Học thẻ" review run.
 * `startFlashcardReviewSession` (already persisted server-side — 2026-07-11
 * đính chính, thầy: "ôn thẻ giao diện y chang... để lưu lại phiên ôn") records
 * this id right after resolving a draw for the deck; returning to it later
 * resumes the persisted progress instead of starting fresh. Threads the
 * route's `sessionId` down as `resumeReviewSessionId` so {@link Flashcards}
 * (and, further down, `FlashcardReviewer`) knows to hydrate rather than
 * resolve one itself. `deckId` is still read back out of the URL by
 * `useFlashcardNav` (positional, tolerates the extra `sessions/[id]`
 * segments). Mirrors `learn/flashcards/quiz/sessions/[sessionId]`.
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <Flashcards resumeReviewSessionId={sessionId} />
}

export default Page
