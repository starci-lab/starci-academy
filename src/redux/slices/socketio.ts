import type {
    GlobalSearchSocketIoMessage,
    JobStatusUpdatedSocketIoMessage,
} from "@/modules/types"
import {
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit"

/**
 * Redux state for data pushed over Socket.IO connections.
 */
export interface SocketIOSlice {
    /** The global search results. */
    globalSearchResults?: GlobalSearchSocketIoMessage
    /** Latest status envelope per job id (from job_notifications namespace). */
    jobStatusByJobId: Record<string, JobStatusUpdatedSocketIoMessage>
}

/**
 * The initial state of the socketio slice.
 */
const initialState: SocketIOSlice = {
    /** The global search results. */
    globalSearchResults: undefined,
    jobStatusByJobId: {},
}

/**
 * Slice storing real-time Socket.IO messages (search results and job status updates).
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
            /** Store (or overwrite) the latest status message for a specific job id. */
            setJobStatusMessageForJob: (
                state,
                action: PayloadAction<SetJobStatusMessageForJobPayload>,
            ) => {
                const {
                    jobId,
                    message
                } = action.payload
                state.jobStatusByJobId[jobId] = message
            },
        },
    },
)

/** The payload for the set job status message for job action. */
export interface SetJobStatusMessageForJobPayload {
    /** The job id. */
    jobId: string
    /** The message. */
    message: JobStatusUpdatedSocketIoMessage
}

/** Root reducer for the socketio slice. */
export const socketIoReducer = socketIoSlice.reducer
/** Actions exported from the socketio slice. */
export const {
    setGlobalSearchResults,
    setJobStatusMessageForJob,
} = socketIoSlice.actions
