"use client"

import React from "react"
import { Flashcards } from "@/components/features/learn/Flashcards"

/**
 * Learn / flashcards — QUIZ mode ("Hỏi nhanh"): a fixed-length random voice
 * session over the whole course. Mode = the route slug (`…/flashcards/quiz`).
 * Named "quiz", not "interview" — a separate feature from AI Mock Interview
 * (`learn/mock-interview`); the old naming collided and caused confusion.
 */
const Page = () => {
    return <Flashcards />
}

export default Page
