"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / review / sessions / [sessionId] — the ONE dedicated,
 * resumable URL for a live "Học thẻ" run, whichever kind started it (thầy
 * 2026-07-11: "bỏ deck đi, only session thôi" — supersedes the earlier
 * `review/decks/[deckId]/sessions/[sessionId]` route; deck-review and
 * due-review now share this single shape). Carries ONLY the sessionId — no
 * `?deckId=` hint (thầy: "session đã persist hết rồi") — `Flashcards`
 * resolves deck identity (if any) via `myFlashcardReviewSessionBySessionId`
 * before rendering `FlashcardReviewer` (deck) or `DueReview` (due).
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <Flashcards resumeStudySessionId={sessionId} />
}

export default Page
