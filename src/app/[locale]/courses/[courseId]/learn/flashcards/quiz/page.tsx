"use client"

import React from "react"
import { FlashcardsPage } from "@/components/pages/FlashcardsPage"

/**
 * Learn / flashcards — QUIZ mode ("Quick Quiz"): a fixed-length random voice
 * session over the whole course. Mode = the route slug (`…/flashcards/quiz`).
 * Named "quiz", not "interview" — a separate feature from AI Mock Interview
 * (`learn/mock-interview`); the old naming collided and caused confusion.
 */
const Page = () => {
    return <FlashcardsPage />
}

export default Page
