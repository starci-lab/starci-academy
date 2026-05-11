import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { MilestoneEntity } from "@/modules/types"
import { JobStatus } from "@/modules/types"

export interface MilestoneState {
    entities: Array<MilestoneEntity>
    selectedTaskId?: string
    selectedAttemptId?: string
    selectedMilestoneId?: string
    /** Job ID of the currently running review job for the selected task. */
    reviewJobId?: string
    /** Current status of the review job. */
    reviewJobStatus?: JobStatus
}

const initialState: MilestoneState = {
    entities: [],
    selectedTaskId: undefined,
    selectedAttemptId: undefined,
    selectedMilestoneId: undefined,
    reviewJobId: undefined,
    reviewJobStatus: undefined,
}

const slice = createSlice({
    name: "milestone",
    initialState,
    reducers: {
        setMilestones: (state, action: PayloadAction<Array<MilestoneEntity>>) => {
            state.entities = action.payload
        },
        resetMilestones: (state) => {
            state.entities = []
        },
        setSelectedTaskId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedTaskId = action.payload
        },
        setSelectedAttemptId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedAttemptId = action.payload
        },
        setSelectedMilestoneId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedMilestoneId = action.payload
        },
        setReviewJob: (state, action: PayloadAction<{ jobId: string; status: JobStatus }>) => {
            state.reviewJobId = action.payload.jobId
            state.reviewJobStatus = action.payload.status
        },
        clearReviewJob: (state) => {
            state.reviewJobId = undefined
            state.reviewJobStatus = undefined
        },
    },
})

export const {
    setMilestones,
    resetMilestones,
    setSelectedTaskId,
    setSelectedAttemptId,
    setSelectedMilestoneId,
    setReviewJob,
    clearReviewJob,
} = slice.actions
export const milestoneReducer = slice.reducer
