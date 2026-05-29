import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeReferenceEntity} (`field`: typically `alias`).
 */
export interface ChallengeReferenceTranslationEntity extends AbstractEntity {
    /** Owning challenge reference id. */
    challengeReferenceId: string
    /** Locale code (e.g. `vi`, `en`). */
    locale: string
    /** Field name being translated (typically `alias`). */
    field: string
    /** Translated value. */
    value: string
}
