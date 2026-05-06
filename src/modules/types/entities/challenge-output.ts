import type { AbstractEntity } from "./abstract"
import type { ChallengeOutputTranslationEntity } from "./challenge-output-translation"

/**
 * Expected output row for a challenge.
 */
export interface ChallengeOutputEntity extends AbstractEntity {
    /** Output text / statement. */
    text: string
    /** Order within the challenge output list. */
    orderIndex: number
    /** Default locale for this row. */
    defaultLocale: string
    /** Localized field overrides. */
    translations?: Array<ChallengeOutputTranslationEntity>
}
