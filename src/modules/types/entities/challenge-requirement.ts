import type { AbstractEntity } from "./abstract"
import type { ChallengeRequirementTranslationEntity } from "./challenge-requirement-translation"

/**
 * One detailed requirement row for a challenge.
 */
export interface ChallengeRequirementEntity extends AbstractEntity {
    /** Goal statement of this requirement. */
    purpose: string
    /** Technical constraints to follow. */
    technicalConstraints: string
    /** Hints and implementation tips. */
    proTipsHints: string
    /** Explicit forbidden practices. */
    forbidden: string
    /** Order within the challenge requirement list. */
    orderIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field overrides. */
    translations?: Array<ChallengeRequirementTranslationEntity>
}
