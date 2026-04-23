import type {
    GlobalSearchSocketIoMessage,
    JobStatusUpdatedSocketIoMessage,
} from "@/hooks"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * The slice for the content.
 */
export interface SocketIOSlice {
    /** The global search results. */
    globalSearchResults?: GlobalSearchSocketIoMessage
    /** Latest status envelope per job id (from job_notifications namespace). */
    jobStatusByJobId: Record<string, JobStatusUpdatedSocketIoMessage>
}

/**
 * The initial state of the content slice.
 */
const initialState: SocketIOSlice = {
    /** The global search results. */
    globalSearchResults: undefined,
    jobStatusByJobId: {},
}

/**
 * The slice for the socketio.
 */
export const socketIoSlice = createSlice(
    {
        /** The name of the slice. */
        name: "socketio",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the global search results. */
            setGlobalSearchResults: (
                state,
                action: PayloadAction<GlobalSearchSocketIoMessage | undefined>,
            ) => {
                state.globalSearchResults = action.payload
            },
            setJobStatusMessageForJob: (
                state,
                action: PayloadAction<SetJobStatusMessageForJobPayload>,
            ) => {
                const { challengeSubmissionId, message } = action.payload
                state.jobStatusByJobId[challengeSubmissionId] = message
            },
        },
    },
)

/** The payload for the set job status message for job action. */
export interface SetJobStatusMessageForJobPayload {
    /** The challenge submission id. */
    challengeSubmissionId: string
    /** The message. */
    message: JobStatusUpdatedSocketIoMessage
}

/**
 * The reducer for the socketio slice.
 */
export const socketIoReducer = socketIoSlice.reducer
export const { 
    setGlobalSearchResults, 
    setJobStatusMessageForJob 
} = socketIoSlice.actions