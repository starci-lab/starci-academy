import type { IncompleteJobsItem } from "@/modules/api"
import { JobStatus } from "@/modules/types"
import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

/**
 * Job-related client state: in-flight / incomplete work keyed by API snapshots.
 */
export interface JobSlice {
    /**
     * Incomplete jobs for the current course (`jobId` + `status`), filled from GraphQL
     * and trimmed/updated via {@link applyIncompleteJobStatus} when Socket.IO pushes status.
     */
    incompleteJobs: Array<IncompleteJobsItem>
}

const initialState: JobSlice = {
    incompleteJobs: [],
}   

export const jobSlice = createSlice(
    {
        name: "job",
        initialState,
        reducers: {
            setIncompleteJobs: (
                state,
                action: PayloadAction<Array<IncompleteJobsItem>>,
            ) => {
                state.incompleteJobs = action.payload
            },
            /**
             * Merge a socket `JobStatusUpdated` into the list: update `status` while queued/processing;
             * drop the row when the job is terminal (no longer "incomplete").
             */
            applyIncompleteJobStatus: (
                state,
                action: PayloadAction<ApplyIncompleteJobStatusPayload>,
            ) => {
                const { jobId, status } = action.payload
                const i = state.incompleteJobs.findIndex(
                    (incompleteJob) => incompleteJob.jobId === jobId,
                )
                if (i === -1) {
                    return
                }
                if (status === JobStatus.Completed || status === JobStatus.Failed) {
                    state.incompleteJobs.splice(
                        i,
                        1,
                    )
                } else {
                    state.incompleteJobs[i] = {
                        jobId,
                        status,
                    }
                }
            },
        },
    },
)

export interface ApplyIncompleteJobStatusPayload {
    /** `JobStatusUpdated.data.jobId` */
    jobId: string
    /** `JobStatusUpdated.data.status` */
    status: JobStatus
}

export const jobReducer = jobSlice.reducer
export const {
    setIncompleteJobs,
    applyIncompleteJobStatus,
} = jobSlice.actions
