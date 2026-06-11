import type { AbstractEntity } from "./abstract"
import type { ChallengeStepTranslationEntity } from "./challenge-step-translation"

/**
 * Ordered instruction step within a challenge (short plain `description` + Markdown `body`).
 *
 * Mirrors Nest `ChallengeStepEntity` / table `challenge_steps`
 * (`ref/sql/challenge-step.entity copy.ts`).
 */
export interface ChallengeStepEntity extends AbstractEntity {
    /** Step title (default locale). */
    title: string
    /** Short step summary (plain text); use `body` for Markdown. */
    description: string
    /** Main step content as Markdown. */
    body: string
    /** Pure ordering index used to sort/reorder (1-based). */
    sortIndex: number
    /** Default locale for this row (Nest `Locale` / GraphQL `GraphQLTypeLocale`). */
    defaultLocale: string
    /**
     * Localized overrides for `title`, `description`, `body`.
     * Nest exposes a non-empty array when loaded; optional when not selected.
     */
    translations?: Array<ChallengeStepTranslationEntity>
}
