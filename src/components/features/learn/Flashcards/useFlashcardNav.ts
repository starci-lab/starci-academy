"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

/**
 * The two top-level flashcard modes, each its own route slug. Named "quiz" (not
 * "interview") on purpose — this is a DIFFERENT feature from the separate AI
 * Mock Interview (`learn/mock-interview`); reusing "interview" here read as the
 * same feature and caused real confusion (thầy: "đừng gọi là interview... kẻo
 * nhầm với interview"). Matches the BE naming already in place
 * (`FlashcardQuizSessionEntity`/`completeFlashcardQuizSession`).
 */
export type FlashcardMode = "study" | "quiz"

/** URL slug per mode (English, reads in the path: `…/flashcards/review`). */
const MODE_SLUG: Record<FlashcardMode, string> = {
    study: "review",
    quiz: "quiz",
}

/**
 * URL-backed navigation for the flashcards surface. The MODE is a route segment
 * (`…/flashcards/review` | `…/flashcards/quiz`) so each mode is its own page
 * with a readable English slug; the open deck rides as ITS OWN route segment too
 * (`…/flashcards/review/decks/<id>`, traceable/shareable — thầy 2026-07-09: "trên
 * url cũng không có cái deck của phần ôn"), mirroring `quiz/sessions/<id>`. Only
 * the cross-deck due session (no id of its own) stays a query param
 * (`?session=due`). The LEFT RAIL (rendered by the learn layout) and the work
 * PANE (the page) both read this hook → one source of truth across the
 * layout↔page boundary, like the content-map rail drives the reader by route.
 */
export const useFlashcardNav = () => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    // the segment right after "flashcards" carries the mode slug; `…/flashcards`
    // (no slug) = study. Read it by position off the "flashcards" segment rather
    // than the LAST path segment, so the resumable `…/quiz/sessions/[id]` /
    // `…/review/decks/[id]` routes (which have extra segments past the mode
    // slug) still resolve to the right mode.
    const segments = pathname.split("/")
    const flashcardsIndex = segments.indexOf("flashcards")
    const modeSegment = flashcardsIndex >= 0 ? segments[flashcardsIndex + 1] : undefined
    const mode: FlashcardMode = modeSegment === MODE_SLUG.quiz ? "quiz" : "study"
    // the flashcards root (everything up to and including the "flashcards" segment)
    const root =
        flashcardsIndex >= 0
            ? segments.slice(0, flashcardsIndex + 1).join("/")
            : pathname

    // `…/flashcards/review/decks/<id>` — the deck id is the segment right after
    // "decks", only meaningful in study mode.
    const decksIndex = flashcardsIndex >= 0 ? segments.indexOf("decks", flashcardsIndex) : -1
    const deckId = mode === "study" && decksIndex >= 0 ? (segments[decksIndex + 1] ?? null) : null
    const session = params.get("session")

    /** Build a flashcards URL: the mode's route + optional deck segment / session query. */
    const build = (
        nextMode: FlashcardMode,
        opts: { deck?: string | null; session?: string | null } = {},
    ): string => {
        const path = opts.deck
            ? `${root}/${MODE_SLUG[nextMode]}/decks/${opts.deck}`
            : `${root}/${MODE_SLUG[nextMode]}`
        if (opts.session) {
            const qs = new URLSearchParams({ session: opts.session }).toString()
            return `${path}?${qs}`
        }
        return path
    }

    return {
        /** Active mode (study | quiz). */
        mode,
        /** Open deck id, or null (overview / topic picker). */
        deckId,
        /** Active session marker (`"due"` = cross-deck due session). */
        session,
        /** Switch mode (its own route; clears any open deck / session). */
        goMode: (nextMode: FlashcardMode) => router.push(build(nextMode, {})),
        /** Open a deck in the current mode's pane. */
        goDeck: (id: string) => router.push(build(mode, { deck: id })),
        /** Start the cross-deck due-review session. */
        goDue: () => router.push(build("study", { session: "due" })),
        /** Return the study pane to its overview (due + mastery). */
        goOverview: () => router.push(build("study", {})),
    }
}
