/**
 * Per-locale title for a SCHEMA V2 prerequisite item (usually null).
 * Mirrors Nest `ChallengePrerequisiteV2TranslationEntity` / `challenge_prerequisite_v2_translations`.
 */
export interface ChallengePrerequisiteV2TranslationEntity {
    /** Parent prerequisite item id (composite PK). */
    challengePrerequisiteV2Id: string
    /** Locale of this title (composite PK). */
    locale: string
    /** Localized prerequisite title (usually null). */
    title: string | null
}
