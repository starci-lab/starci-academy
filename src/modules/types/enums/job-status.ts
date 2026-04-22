// Worker job lifecycle in the queue.
export enum JobStatus {
    /** The job is queued and waiting to be processed. */
    Queued = "queued",
    /** The job is processing. */
    Processing = "processing",
    /** The job is completed. */
    Completed = "completed",
    /** The job is failed. */
    Failed = "failed",
}
