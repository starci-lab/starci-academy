import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { MilestoneEntity, MilestoneTaskEntity } from "@/modules/types"

export interface MilestoneState {
    entities: Array<MilestoneEntity>
    /** Task payload for the current `selectedTaskId` (from `task` GraphQL, hydrated by SWR). */
    selectedTaskDetail?: MilestoneTaskEntity
    selectedTaskId?: string
    selectedAttemptId?: string
    selectedMilestoneId?: string
    /**
     * Maps `milestone_tasks.id` → async grading `jobs.id` after submit succeeds.
     * Used with `socketIo.jobStatusByJobId[jobId]`.
     */
    milestoneTaskIdToJobId: Record<string, string>
}

const initialState: MilestoneState = {
    entities: [],
    selectedTaskDetail: undefined,
    selectedTaskId: undefined,
    selectedAttemptId: undefined,
    selectedMilestoneId: undefined,
    milestoneTaskIdToJobId: {},
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
            state.selectedTaskDetail = undefined
        },
        setSelectedTaskDetail: (state, action: PayloadAction<MilestoneTaskEntity | undefined>) => {
            state.selectedTaskDetail = action.payload
        },
        setSelectedTaskId: (state, action: PayloadAction<string | undefined>) => {
            if (state.selectedTaskId !== action.payload) {
                state.selectedTaskDetail = undefined
            }
            state.selectedTaskId = action.payload
        },
        setSelectedAttemptId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedAttemptId = action.payload
        },
        setSelectedMilestoneId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedMilestoneId = action.payload
        },
        addMilestoneTaskIdToJobId: (state, action: PayloadAction<AddMilestoneTaskIdToJobIdPayload>) => {
            state.milestoneTaskIdToJobId[action.payload.milestoneTaskId] = action.payload.jobId
        },
        removeMilestoneTaskIdToJobId: (state, action: PayloadAction<string>) => {
            delete state.milestoneTaskIdToJobId[action.payload]
        },
    },
})

export const {
    setMilestones,
    resetMilestones,
    setSelectedTaskDetail,
    setSelectedTaskId,
    setSelectedAttemptId,
    setSelectedMilestoneId,
    addMilestoneTaskIdToJobId,
    removeMilestoneTaskIdToJobId,
} = slice.actions
export const milestoneReducer = slice.reducer

/** Payload for adding a milestone task ID to job ID mapping. */
export interface AddMilestoneTaskIdToJobIdPayload {
    /** Milestone task ID. */
    milestoneTaskId: string
    /** Job ID. */
    jobId: string
}
