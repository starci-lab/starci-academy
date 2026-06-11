import type { AbstractEntity } from "./abstract"
import type { ChallengePrerequisiteTranslationEntity } from "./challenge-prerequisite-translation"

/**
 * One prerequisite row for a challenge.
 */
export interface ChallengePrerequisiteEntity extends AbstractEntity {
    /** Prerequisite text. */
    text: string
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field overrides. */
    translations?: Array<ChallengePrerequisiteTranslationEntity>
}
