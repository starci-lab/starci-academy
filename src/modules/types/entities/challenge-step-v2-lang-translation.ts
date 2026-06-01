/**
 * Per-locale body for a SCHEMA V2 step language row.
 * Mirrors Nest `ChallengeStepV2LangTranslationEntity` / `challenge_step_v2_lang_translations`.
 */
export interface ChallengeStepV2LangTranslationEntity {
    /** Parent step language row id (composite PK). */
    challengeStepV2LangId: string
    /** Locale of this body (composite PK). */
    locale: string
    /** Localized step body markdown. */
    body: string | null
}
