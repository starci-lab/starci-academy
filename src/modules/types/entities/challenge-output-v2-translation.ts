/**
 * Per-locale title for a SCHEMA V2 output item (usually null).
 * Mirrors Nest `ChallengeOutputV2TranslationEntity` / `challenge_output_v2_translations`.
 */
export interface ChallengeOutputV2TranslationEntity {
    /** Parent output item id (composite PK). */
    challengeOutputV2Id: string
    /** Locale of this title (composite PK). */
    locale: string
    /** Localized output title (usually null). */
    title: string | null
}
