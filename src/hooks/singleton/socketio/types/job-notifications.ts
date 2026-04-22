import type { JobStatus } from "@/modules/types"
import type { SocketIoMessage } from "./ws-message"
import type { SocketIoPayload } from "./ws-payload"

/** Client → server: join updates for a queue job. */
export type SubscribeJobNotificationSocketIoPayload = SocketIoPayload<{
    /** The BullMQ / worker job id. */
    jobId: string
}>

/** Data broadcast when a job’s status changes. */
export interface JobStatusUpdatedData {
    /** The BullMQ / worker job id. */
    jobId: string
    /** The challenge submission id. */
    challengeSubmissionId: string
    /** The status of the job. */
    status: JobStatus
    /** The error message of the job. */
    error?: string
}

/** Server → client: full envelope for job status. */
export type JobStatusUpdatedSocketIoMessage = SocketIoMessage<JobStatusUpdatedData>
