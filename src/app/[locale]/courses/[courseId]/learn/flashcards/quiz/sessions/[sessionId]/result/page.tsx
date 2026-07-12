"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / quiz / sessions / [sessionId] / result — the dedicated
 * RESULT URL for a FINISHED "Hỏi nhanh" run, separate from the live
 * `.../sessions/[sessionId]` route (2026-07-12). Whether a session is "done"
 * is now answered by the ROUTE itself instead of re-derived client-side from
 * `status`/`currentIndex` at the live URL — that inference had no way to tell
 * "about to answer the last card" from "just answered it" apart (both read
 * identically), so a session whose completion write never landed kept
 * resuming into the last card on every revisit/F5 instead of showing
 * results. `QuizSession` navigates here once `completeFlashcardQuizSession`
 * resolves; `Flashcards` renders `FlashcardQuizResult` directly — no
 * in-progress check, this URL only ever means "show the result".
 */
const Page = () => {
    const params = useParams()
    const sessionId = params.sessionId as string | undefined
    return <Flashcards resultQuizSessionId={sessionId} />
}

export default Page
