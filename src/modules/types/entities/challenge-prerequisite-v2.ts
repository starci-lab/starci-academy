import type { AbstractEntity } from "./abstract"
import type { ChallengePrerequisiteV2LangEntity } from "./challenge-prerequisite-v2-lang"

/**
 * SCHEMA V2 prerequisite item (one row per position).
 * Mirrors Nest `ChallengePrerequisiteV2Entity` / `challenge_prerequisites_v2`.
 * CDN payload has no item-level title; only per-lang `text` rows.
 */
export interface ChallengePrerequisiteV2Entity extends AbstractEntity {
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this prerequisite item. */
    defaultLocale: string
    /** Per-programming-language text rows. */
    langs?: Array<ChallengePrerequisiteV2LangEntity>
}
