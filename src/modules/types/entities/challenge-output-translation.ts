import type { AbstractEntity } from "./abstract"

/**
 * Localized row for a {@link ChallengeOutputEntity}.
 */
export interface ChallengeOutputTranslationEntity extends AbstractEntity {
    /** Owning challenge output id. */
    challengeOutputId: string
    /** Locale code (e.g. `vi`, `en`). */
    locale: string
    /** Field name being translated. */
    field: string
    /** Translated value. */
    value: string
}
