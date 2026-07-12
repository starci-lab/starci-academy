"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / review / sessions / [sessionId] / result — the
 * dedicated RESULT URL for a FINISHED "Học thẻ" run (either kind — single-deck
 * review or cross-deck due), separate from the live
 * `.../sessions/[sessionId]` route (2026-07-12). Mirrors
 * `flashcards/quiz/sessions/[sessionId]/result`'s own doc for the full
 * root-cause: "done" is now answered by the ROUTE, not re-derived
 * client-side from `status`/`currentIndex` at the live URL.
 * `DueReview`/`FlashcardReviewer` navigate here once their completion
 * mutation resolves; `Flashcards` renders `FlashcardSessionStats` directly —
 * no in-progress check, this URL only ever means "show the result".
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <Flashcards resultStudySessionId={sessionId} />
}

export default Page
