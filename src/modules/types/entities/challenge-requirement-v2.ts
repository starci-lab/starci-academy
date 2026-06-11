import type { AbstractEntity } from "./abstract"
import type { ChallengeRequirementV2LangEntity } from "./challenge-requirement-v2-lang"

/**
 * SCHEMA V2 requirement item (one row per position).
 * Mirrors Nest `ChallengeRequirementV2Entity` / `challenge_requirements_v2`.
 * Title/body live on each {@link ChallengeRequirementV2LangEntity} row.
 */
export interface ChallengeRequirementV2Entity extends AbstractEntity {
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this requirement item. */
    defaultLocale: string
    /** Per-programming-language score + title + body rows. */
    langs?: Array<ChallengeRequirementV2LangEntity>
}
