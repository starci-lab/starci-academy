import type { AbstractEntity } from "./abstract"
import type { ChallengeSubmissionEntity } from "./challenge-submission"
import type { UserEntity } from "./user"

/**
 * Join row user ↔ challenge submission (`user_submissions`).
 * Mirrors `ref/user-challenge-submission.entity.ts`.
 */
export interface UserChallengeSubmissionEntity extends AbstractEntity {
    user: UserEntity
    userId: string
    /** Parent submission row; may be omitted in shallow queries. */
    submission?: ChallengeSubmissionEntity
    submissionId: string
    submissionUrl: string
    attempts: number
    score: number
}
