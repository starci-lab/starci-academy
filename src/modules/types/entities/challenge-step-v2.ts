import type { AbstractEntity } from "./abstract"
import type { ChallengeStepV2LangEntity } from "./challenge-step-v2-lang"

/**
 * SCHEMA V2 step item (one row per position).
 * Mirrors Nest `ChallengeStepV2Entity` / `challenge_steps_v2`.
 * Title/body live on each {@link ChallengeStepV2LangEntity} row.
 */
export interface ChallengeStepV2Entity extends AbstractEntity {
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this step item. */
    defaultLocale: string
    /** Per-programming-language title + body rows. */
    langs?: Array<ChallengeStepV2LangEntity>
}
