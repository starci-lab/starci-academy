import type { IncompleteChallengeSubmissionJobsItem } from "@/modules/api"
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
     * Last successful `incompleteChallengeSubmissionJobs` rows for the current course
     * (`jobId` + `status` per line item).
     */
    incompleteChallengeSubmissionJobs: Array<IncompleteChallengeSubmissionJobsItem>
}

const initialState: JobSlice = {
    incompleteChallengeSubmissionJobs: [],
}

export const jobSlice = createSlice(
    {
        name: "job",
        initialState,
        reducers: {
            setIncompleteChallengeSubmissionJobs: (
                state,
                action: PayloadAction<Array<IncompleteChallengeSubmissionJobsItem>>,
            ) => {
                state.incompleteChallengeSubmissionJobs = action.payload
            },
            /**
             * Merge a socket `JobStatusUpdated` into the list: update `status` while queued/processing;
             * drop the row when the job is terminal (no longer "incomplete").
             */
            applyIncompleteJobStatusFromSocket: (
                state,
                action: PayloadAction<ApplyIncompleteJobStatusFromSocketPayload>,
            ) => {
                const { jobId, status } = action.payload
                const i = state.incompleteChallengeSubmissionJobs.findIndex(
                    (row) => row.jobId === jobId,
                )
                if (i === -1) {
                    return
                }
                if (status === JobStatus.Completed || status === JobStatus.Failed) {
                    state.incompleteChallengeSubmissionJobs.splice(
                        i,
                        1,
                    )
                } else {
                    state.incompleteChallengeSubmissionJobs[i] = {
                        jobId,
                        status,
                    }
                }
            },
        },
    },
)

export interface ApplyIncompleteJobStatusFromSocketPayload {
    /** `JobStatusUpdated.data.jobId` */
    jobId: string
    /** `JobStatusUpdated.data.status` */
    status: JobStatus
}

export const jobReducer = jobSlice.reducer
export const {
    setIncompleteChallengeSubmissionJobs,
    applyIncompleteJobStatusFromSocket,
} = jobSlice.actions
