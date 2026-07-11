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
 * with a readable English slug. Both "Học thẻ" session kinds — a single deck or
 * the cross-deck due queue — now share ONE live shape,
 * `…/flashcards/review/sessions/<sessionId>` (thầy 2026-07-11: "bỏ deck đi, only
 * session thôi" — no more `decks/<id>` route segment, superseding the
 * 2026-07-09 "deck rides its own segment" decision). `deckId` travels as a
 * query hint (`?deckId=`) instead: on the bare shim (`review?deckId=<id>`) it
 * says WHICH deck to start/resume; on the live sessioned URL it's a HINT so a
 * direct link/refresh still knows to resume the DECK-scoped session (not the
 * due one) — `useQueryMyInProgressFlashcardReviewSessionSwr` needs a deckId to
 * scope its lookup, there is no id-only "which session is this" query. The
 * cross-deck due session stays its own query marker (`?session=due`) on the
 * bare shim; once live it carries no `deckId` at all. The LEFT RAIL (rendered
 * by the learn layout) and the work PANE (the page) both read this hook → one
 * source of truth across the layout↔page boundary.
 */
export const useFlashcardNav = () => {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    // the segment right after "flashcards" carries the mode slug; `…/flashcards`
    // (no slug) = study. Read it by position off the "flashcards" segment rather
    // than the LAST path segment, so the resumable `…/quiz/sessions/[id]` /
    // `…/review/sessions/[id]` routes (which have extra segments past the mode
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

    // `?deckId=` — the deck-review shim/resume hint, only meaningful in study mode.
    const deckId = mode === "study" ? params.get("deckId") : null
    const session = params.get("session")

    /** Build a flashcards URL: the mode's route + optional deck / session query hint. */
    const build = (
        nextMode: FlashcardMode,
        opts: { deck?: string | null; session?: string | null } = {},
    ): string => {
        const path = `${root}/${MODE_SLUG[nextMode]}`
        const qs = new URLSearchParams()
        if (opts.deck) {
            qs.set("deckId", opts.deck)
        }
        if (opts.session) {
            qs.set("session", opts.session)
        }
        const qsStr = qs.toString()
        return qsStr ? `${path}?${qsStr}` : path
    }

    return {
        /** Active mode (study | quiz). */
        mode,
        /** Deck-review shim/resume hint, or null (overview / due session / topic picker). */
        deckId,
        /** Active session marker (`"due"` = cross-deck due session). */
        session,
        /** Switch mode (its own route; clears any open deck / session). */
        goMode: (nextMode: FlashcardMode) => router.push(build(nextMode, {})),
        /** Start/resume a deck's review (resolve-or-start shim, `?deckId=`). */
        goDeck: (id: string) => router.push(build(mode, { deck: id })),
        /** Return the study pane to its overview (due + mastery). */
        goOverview: () => router.push(build("study", {})),
    }
}
