import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeOutputEntity}.
 */
export interface ChallengeOutputTranslationEntity extends AbstractEntity {
    challengeOutputId: string
    locale: string
    field: string
    value: string
}
