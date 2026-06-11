import type { AbstractEntity } from "./abstract"
import type { ChallengeReferenceTranslationEntity } from "./challenge-reference-translation"

/**
 * External URL reference attached to a challenge (docs, repos, etc.).
 */
export interface ChallengeReferenceEntity extends AbstractEntity {
    /** Alias for this reference. */
    alias: string
    /** Target URL (not localized). */
    url: string
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field values (e.g. locale-specific `url`). */
    translations?: Array<ChallengeReferenceTranslationEntity>
}
