import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * Selected CV submission attempt shown in the analysis modal.
 */
export interface CvSubmissionAttemptAnalysisItem {
    /** Unique attempt id from the API. */
    attemptId: string
    /** Human-visible attempt number. */
    attemptNumber: number
    /** Display label for the uploaded CV file. */
    fileLabel: string
    /** Public or signed URL for opening the CV file. */
    fileUrl: string
    /** Whether the file URL can be opened directly. */
    fileUrlIsPublic: boolean
    /** Formatted submission timestamp. */
    submittedAtLabel: string
    /** Raw attempt status from the API. */
    status: string
    /** Full AI feedback markdown for this attempt. */
    detailFeedback: string
}

export interface CvSubmissionAttemptAnalysisSlice {
    /** Attempt currently selected for the analysis modal. */
    selectedAttempt: CvSubmissionAttemptAnalysisItem | null
}

const initialState: CvSubmissionAttemptAnalysisSlice = {
    selectedAttempt: null,
}

export const cvSubmissionAttemptAnalysisSlice = createSlice({
    name: "cvSubmissionAttemptAnalysis",
    initialState,
    reducers: {
        setSelectedCvSubmissionAttemptAnalysis: (
            state,
            action: PayloadAction<CvSubmissionAttemptAnalysisItem>,
        ) => {
            state.selectedAttempt = action.payload
        },
        clearSelectedCvSubmissionAttemptAnalysis: (state) => {
            state.selectedAttempt = null
        },
    },
})

export const {
    setSelectedCvSubmissionAttemptAnalysis,
    clearSelectedCvSubmissionAttemptAnalysis,
} = cvSubmissionAttemptAnalysisSlice.actions

export const cvSubmissionAttemptAnalysisReducer = cvSubmissionAttemptAnalysisSlice.reducer
