import type {
    JobStatus,
    JobType,
} from "@/modules/types"

/**
 * Server push when a challenge-submission job status changes.
 */
export interface JobStatusUpdatedSocketIoMessage {
    data?: {
        challengeSubmissionId?: string
        jobId?: string
        jobType?: JobType
        status?: JobStatus
        /** Error detail when `status` indicates failure. */
        error?: string
    }
}

/**
 * Client publish to subscribe to updates for a given job (and locale for copy).
 */
export interface SubscribeJobNotificationSocketIoPayload {
    data: {
        jobId: string
    }
    locale: string
}
