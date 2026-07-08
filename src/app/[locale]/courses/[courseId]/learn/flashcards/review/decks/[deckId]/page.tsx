"use client"

import React from "react"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards / review / decks / [deckId] — a deck's SM-2 reviewer.
 * The deck rides as a route segment (not `?deck=`) so it's traceable/shareable
 * (thầy 2026-07-09: "trên url cũng không có cái deck của phần ôn"). `deckId`
 * itself is read back out of the URL by `useFlashcardNav` (not threaded as a
 * prop here) — mirrors how `flashcards/quiz/sessions/[sessionId]` resolves
 * its mode from the pathname rather than a prop for that part.
 */
const Page = () => {
    return <Flashcards />
}

export default Page
