import type { AbstractEntity } from "./abstract"
import type { ChallengePrerequisiteTranslationEntity } from "./challenge-prerequisite-translation"

/**
 * One prerequisite row for a challenge.
 */
export interface ChallengePrerequisiteEntity extends AbstractEntity {
    /** Prerequisite text. */
    text: string
    /** Order within the challenge prerequisite list. */
    orderIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field overrides. */
    translations?: Array<ChallengePrerequisiteTranslationEntity>
}
