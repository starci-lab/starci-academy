/**
 * Translation for challenge step fields (`title`, `description`, `body`).
 * Primary key: `(challengeStepId, locale, field)`.
 *
 * Mirrors Nest `ChallengeStepTranslationEntity` / table `challenge_step_translations`
 * (`ref/sql/challenge-step-translation.entity copy.ts`). Backend extends `AbstractEntity`
 * for audit columns; GraphQL may or may not expose `createdAt` / `updatedAt`.
 */
export interface ChallengeStepTranslationEntity {
    challengeStepId: string
    /** Locale (Nest `Locale` enum). */
    locale: string
    field: string
    value: string
    createdAt?: Date
    updatedAt?: Date
}
