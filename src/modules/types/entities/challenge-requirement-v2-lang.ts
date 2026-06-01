import type { AbstractEntity } from "./abstract"

/**
 * Per-programming-language content of a SCHEMA V2 requirement item (`score` + localized `body`).
 * Mirrors Nest `ChallengeRequirementV2LangEntity` / `challenge_requirement_v2_langs`.
 * CDN payload exposes resolved `body` per request locale (no nested `translations`).
 */
export interface ChallengeRequirementV2LangEntity extends AbstractEntity {
    /** Programming language (typescript, java, csharp, go, …). */
    lang: string
    /** Display order within the parent requirement item's language list. */
    orderIndex: number
    /** Points / weight for this requirement in this language. */
    score: number
    /** Default locale for this language row. */
    defaultLocale: string
    /** Localized body for the active request locale. */
    body?: string
    /** Localized title for the active request locale (lang-bucket inner rows). */
    title?: string
}
