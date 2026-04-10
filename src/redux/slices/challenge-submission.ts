import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the challenge.
 */
export interface ChallengeSubmissionSlice {
    /** The challenge submission id. */
    id?: string
}

/**
 * The initial state of the challenge submission slice.
 */
const initialState: ChallengeSubmissionSlice = {
    /** The challenge submission id. */
    id: undefined,
}

/**
 * The slice for the challenge.
 */
export const challengeSubmissionSlice = createSlice(
    {
        /** The name of the slice. */
        name: "challengeSubmission",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the challenge submission. */
            setChallengeSubmissionId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
        },
    }
)

/**
 * The reducer for the challenge submission slice.
 */
export const challengeSubmissionReducer = challengeSubmissionSlice.reducer
export const { 
    setChallengeSubmissionId,
} = challengeSubmissionSlice.actions