/**
 * Per-locale `text` override for a SCHEMA V2 output language row.
 * Mirrors Nest `ChallengeOutputV2LangTranslationEntity` / `challenge_output_v2_lang_translations`.
 */
export interface ChallengeOutputV2LangTranslationEntity {
    /** Parent output language row id (composite PK). */
    challengeOutputV2LangId: string
    /** Locale of this translation (composite PK). */
    locale: string
    /** Target field name being translated (composite PK). */
    field: string
    /** Translated value for the field. */
    value: string
}
