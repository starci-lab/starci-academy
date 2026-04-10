import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"
import { SubmissionAttemptEntity } from "@/modules/types"

/**
 * The slice for the submission attempt.
 */
export interface SubmissionAttemptSlice {
    /** The submission attempt id. */
    id?: string
    /** The submission attempt. */
    submissionAttempt?: SubmissionAttemptEntity
    /** The submission attempts. */
    submissionAttempts: Array<SubmissionAttemptEntity>
    /** The count of the submission attempts. */
    count: number
}

/**
 * The initial state of the challenge submission slice.
 */
const initialState: SubmissionAttemptSlice = {
    /** The submission attempt id. */
    id: undefined,
    /** The submission attempt. */
    submissionAttempt: undefined,
    /** The submission attempts. */
    submissionAttempts: [],
    /** The count of the submission attempts. */
    count: 0,
}

/**
 * The slice for the submission attempt.
 */
export const submissionAttemptSlice = createSlice(
    {
        /** The name of the slice. */
        name: "submissionAttempt",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the submission attempt id. */
            setSubmissionAttemptId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the submission attempt. */
            setSubmissionAttempt: (
                state, 
                action: PayloadAction<SubmissionAttemptEntity | undefined>
            ) => {
                state.submissionAttempt = action.payload
            },
            /** The action to set the submission attempts. */
            setSubmissionAttempts: (
                state, 
                action: PayloadAction<Array<SubmissionAttemptEntity>>
            ) => {
                state.submissionAttempts = action.payload
            },
            /** The action to set the count of the submission attempts. */
            setSubmissionAttemptsCount: (
                state, 
                action: PayloadAction<number>
            ) => {
                state.count = action.payload
            },
        },
    }
)

/**
 * The reducer for the challenge submission slice.
 */
export const submissionAttemptReducer = submissionAttemptSlice.reducer
export const { 
    setSubmissionAttemptId,
    setSubmissionAttempt,
    setSubmissionAttempts,
    setSubmissionAttemptsCount,
} = submissionAttemptSlice.actions