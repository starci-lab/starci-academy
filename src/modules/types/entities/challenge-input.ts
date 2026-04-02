import type { AbstractEntity } from "./abstract"
import type { ChallengeInputTranslationEntity } from "./challenge-input-translation"

/**
 * One input row for a module challenge (prompt / expected-answer hint).
 */
export interface ChallengeInputEntity extends AbstractEntity {
    /** Prompt or description for this input (default locale). */
    description: string
    /** Order within the challenge input list. */
    orderIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field overrides. */
    translations?: Array<ChallengeInputTranslationEntity>
}
