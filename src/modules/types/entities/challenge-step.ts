import type { AbstractEntity } from "./abstract"
import type { ChallengeStepTranslationEntity } from "./challenge-step-translation"

/**
 * Ordered instruction step within a challenge (short plain `description` + Markdown `body`).
 *
 * Mirrors Nest `ChallengeStepEntity` / table `challenge_steps`
 * (`ref/sql/challenge-step.entity copy.ts`).
 */
export interface ChallengeStepEntity extends AbstractEntity {
    title: string
    /** Short step summary (plain text); use `body` for Markdown. */
    description: string
    /** Main step content as Markdown. */
    body: string
    orderIndex: number
    /** Default locale for this row (Nest `Locale` / GraphQL `GraphQLTypeLocale`). */
    defaultLocale: string
    /**
     * Localized overrides for `title`, `description`, `body`.
     * Nest exposes a non-empty array when loaded; optional when not selected.
     */
    translations?: Array<ChallengeStepTranslationEntity>
    /**
     * Parent challenge when the resolver loads the relation (omit in module query if unused).
     */
    challenge?: { id: string }
}
