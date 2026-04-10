import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"
import { SubmissionFeedbackEntity } from "@/modules/types"

/**
 * The slice for the submission feedback.
 */
export interface SubmissionFeedbackSlice {
    /** The submission feedback id. */
    id?: string
    /** The submission feedback. */
    submissionFeedback?: SubmissionFeedbackEntity
    /** The submission feedbacks. */
    submissionFeedbacks: Array<SubmissionFeedbackEntity>
    /** The count of t  he submission feedbacks. */
    count: number
}

/**
 * The initial state of the submission feedback slice.
 */
const initialState: SubmissionFeedbackSlice = {
    /** The submission attempt id. */
    id: undefined,
    /** The submission feedback. */
    submissionFeedback: undefined,
    /** The submission feedbacks. */
    submissionFeedbacks: [],
    /** The count of the submission feedbacks. */
    count: 0,
}

/**
 * The slice for the submission attempt.
 */
export const submissionFeedbackSlice = createSlice(
    {
        /** The name of the slice. */
        name: "submissionFeedback",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the submission feedback id. */
            setSubmissionFeedbackId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the submission feedback. */
            setSubmissionFeedback: (
                state, 
                action: PayloadAction<SubmissionFeedbackEntity | undefined>
            ) => {
                state.submissionFeedback = action.payload
            },
            /** The action to set the submission feedbacks. */
            setSubmissionFeedbacks: (
                state, 
                action: PayloadAction<Array<SubmissionFeedbackEntity>>
            ) => {
                state.submissionFeedbacks = action.payload
            },
            /** The action to set the count of the submission feedbacks. */
            setSubmissionFeedbacksCount: (
                state, 
                action: PayloadAction<number>
            ) => {
                state.count = action.payload
            },
        },
    }
)

/**
 * The reducer for the submission feedback slice.
 */
export const submissionFeedbackReducer = submissionFeedbackSlice.reducer
export const { 
    setSubmissionFeedbackId,
    setSubmissionFeedback,
    setSubmissionFeedbacks,
    setSubmissionFeedbacksCount,
} = submissionFeedbackSlice.actions