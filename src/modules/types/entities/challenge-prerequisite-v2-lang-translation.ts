/**
 * Per-locale `text` override for a SCHEMA V2 prerequisite language row.
 * Mirrors Nest `ChallengePrerequisiteV2LangTranslationEntity` / `challenge_prerequisite_v2_lang_translations`.
 */
export interface ChallengePrerequisiteV2LangTranslationEntity {
    /** Parent prerequisite language row id (composite PK). */
    challengePrerequisiteV2LangId: string
    /** Locale of this translation (composite PK). */
    locale: string
    /** Target field name being translated (composite PK). */
    field: string
    /** Translated value for the field. */
    value: string
}
