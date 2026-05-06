import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeRequirementEntity}.
 */
export interface ChallengeRequirementTranslationEntity extends AbstractEntity {
    challengeRequirementId: string
    locale: string
    field: string
    value: string
}
