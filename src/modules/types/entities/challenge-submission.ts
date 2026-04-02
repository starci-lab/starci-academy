import type { AbstractEntity } from "./abstract"
import type { ChallengeEntity } from "./challenge"
import type { ChallengeSubmissionTranslationEntity } from "./challenge-submission-translation"
import type { SubmissionType } from "../enums/submission-type"
import type { UserChallengeSubmissionEntity } from "./user-challenge-submission"

/**
 * Submission requirement attached to a challenge (`challenge_submissions`).
 * GraphQL object name: `Submission` — mirrors `ref/challenge-submission.entity.ts`.
 *
 * Nested `challenge` / `translations` / `userSubmissions` may be omitted or partial depending on the query.
 */
export interface ChallengeSubmissionEntity extends AbstractEntity {
    type: SubmissionType
    name: string
    description: string | null
    challenge?: ChallengeEntity
    orderIndex: number
    translations?: Array<ChallengeSubmissionTranslationEntity>
    userSubmissions?: Array<UserChallengeSubmissionEntity>
    /** Hydrated for the current user only (not a DB column). */
    userSubmission?: UserChallengeSubmissionEntity | null
}
