import type { AbstractEntity } from "./abstract"
import type { ChallengeReferenceTranslationEntity } from "./challenge-reference-translation"

/**
 * External URL reference attached to a challenge (docs, repos, etc.).
 */
export interface ChallengeReferenceEntity extends AbstractEntity {
    /** Link label (default locale); override via translations `field`: `alias`. */
    alias: string | null
    /** Target URL (not localized). */
    url: string
    orderIndex: number
    defaultLocale: string
    translations?: Array<ChallengeReferenceTranslationEntity>
}
