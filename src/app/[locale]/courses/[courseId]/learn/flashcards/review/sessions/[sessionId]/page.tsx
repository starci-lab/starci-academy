"use client"

import React from "react"
import { useParams } from "next/navigation"
import { FlashcardsPage } from "@/components/pages/FlashcardsPage"

/**
 * Learn / flashcards / review / sessions / [sessionId] — the ONE dedicated,
 * resumable URL for a live "Study Cards" run, whichever kind started it
 * (teacher call 2026-07-11: drop the deck segment — session id alone —
 * supersedes the earlier `review/decks/[deckId]/sessions/[sessionId]` route;
 * deck-review and due-review now share this single shape). Carries ONLY the
 * sessionId — no `?deckId=` hint (teacher: the session already persists
 * everything) — `FlashcardsPage` resolves deck identity (if any) via
 * `myFlashcardReviewSessionBySessionId` before rendering `FlashcardReviewer`
 * (deck) or `DueReview` (due).
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <FlashcardsPage resumeStudySessionId={sessionId} />
}

export default Page
