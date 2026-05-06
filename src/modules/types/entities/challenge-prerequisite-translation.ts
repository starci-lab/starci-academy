import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengePrerequisiteEntity}.
 */
export interface ChallengePrerequisiteTranslationEntity extends AbstractEntity {
    challengePrerequisiteId: string
    locale: string
    field: string
    value: string
}
