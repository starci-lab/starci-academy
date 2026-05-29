import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeRequirementEntity}.
 */
export interface ChallengeRequirementTranslationEntity extends AbstractEntity {
    /** Owning challenge requirement id. */
    challengeRequirementId: string
    /** Locale code (e.g. `vi`, `en`). */
    locale: string
    /** Field name being translated. */
    field: string
    /** Translated value. */
    value: string
}
