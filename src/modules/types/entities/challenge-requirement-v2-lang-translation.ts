/**
 * Per-locale body for a SCHEMA V2 requirement language row.
 * Mirrors Nest `ChallengeRequirementV2LangTranslationEntity` / `challenge_requirement_v2_lang_translations`.
 */
export interface ChallengeRequirementV2LangTranslationEntity {
    /** Parent requirement language row id (composite PK). */
    challengeRequirementV2LangId: string
    /** Locale of this body (composite PK). */
    locale: string
    /** Localized requirement body markdown. */
    body: string | null
}
