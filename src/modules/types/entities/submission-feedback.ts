import { SubmissionFeedbackSeverity } from "../enums"
import { AbstractEntity } from "./abstract"
import { SubmissionAttemptEntity } from "./submission-attempt"
/**
 * A single feedback item for a submission attempt.
 */
export interface SubmissionFeedbackEntity extends AbstractEntity {
    /** The message of the feedback. */
    message: string
    /** The detail of the feedback. */
    detail: string | null
    /** The severity of the feedback. */
    severity: SubmissionFeedbackSeverity
    /** The location of the feedback. */
    location: string | null
    /** The suggestion of the feedback. */
    suggestion: string | null
    /** The order index of the feedback. */
    orderIndex: number
    /** The attempt that the feedback belongs to. */
    attempt: SubmissionAttemptEntity
}

