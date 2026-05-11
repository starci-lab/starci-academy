import type { AbstractEntity } from "./abstract"

/**
 * Links a user's enrollment to a specific milestone task.
 */
export interface UserMilestoneTaskEntity extends AbstractEntity {
    /** Display order within the enrollment's task list. */
    orderIndex: number
    /** Parent enrollment ID. */
    enrollmentId: string
    /** Parent milestone task ID. */
    milestoneTaskId: string
    /** Review attempts for this user milestone task. */
    attempts?: Array<UserMilestoneTaskAttemptEntity>
}

/**
 * A single review attempt for a user milestone task.
 */
export interface UserMilestoneTaskAttemptEntity extends AbstractEntity {
    /** The sequence number of this attempt. */
    attemptNumber: number
    /** Whether the attempt passed. */
    passed: boolean
    /** Score achieved in this attempt. */
    score: number
    /** Feedback summary for this attempt. */
    shortFeedback: string | null
    /** When the attempt was finished processing. */
    processedAt: Date | null
    /** Parent user milestone task ID. */
    userMilestoneTaskId: string
    /** Detailed feedback items for this attempt. */
    feedbacks?: Array<UserMilestoneTaskAttemptFeedbackEntity>
}

/**
 * Structured feedback item for a user milestone task attempt.
 */
export interface UserMilestoneTaskAttemptFeedbackEntity extends AbstractEntity {
    /** Short summary message for this feedback item. */
    message: string
    /** Severity of the feedback item. */
    severity: string
    /** Ordering index within the feedback list. */
    orderIndex: number
    /** Source location hint, e.g. file:line. */
    location: string | null
    /** Suggested change (code snippet or instruction). */
    suggestion: string | null
    /** Parent attempt ID. */
    attemptId: string
}
