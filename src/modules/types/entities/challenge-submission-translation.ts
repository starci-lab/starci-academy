/**
 * Localized field for a challenge submission (`challenge_submission_translations`).
 * Composite key (`challengeSubmissionId`, `locale`, `field`) — mirrors `ref/challenge-submission-translation.entity.ts`.
 */
export interface ChallengeSubmissionTranslationEntity {
    challengeSubmissionId: string
    /** Locale (Nest `Locale` / GraphQL `GraphQLTypeLocale`). */
    locale: string
    field: string
    value: string
}
