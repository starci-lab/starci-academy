import { AbstractEntity } from "./abstract"
import { SubmissionFeedbackEntity } from "./submission-feedback"
import { UserChallengeSubmissionEntity } from "./user-challenge-submission"
/**
 * A single attempt of a user challenge submission.
 */
export interface SubmissionAttemptEntity extends AbstractEntity {
    /** The attempt number. */
    attemptNumber: number
    /** The score of the attempt. */
    score: number | null
    /** The short feedback of the attempt. */
    shortFeedback: string | null
    /** The date and time the attempt was processed. */
    processedAt: Date | null
    /** The URL of the source submitted in this attempt. */
    submissionUrl: string
    /** The parent user challenge submission. */
    userChallengeSubmission: UserChallengeSubmissionEntity
    /** The feedback items for this attempt. */
    feedbacks: Array<SubmissionFeedbackEntity>
}
