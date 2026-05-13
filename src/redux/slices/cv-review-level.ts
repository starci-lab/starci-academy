import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

/**
 * Redux state for the selected CV review rubric template.
 */
export interface CvReviewLevelSlice {
    /** Selected `template_cvs.id`, or empty string when no level is selected. */
    selectedTemplateId: string
}

const initialState: CvReviewLevelSlice = {
    selectedTemplateId: "",
}

export const cvReviewLevelSlice = createSlice({
    name: "cvReviewLevel",
    initialState,
    reducers: {
        setSelectedCvReviewTemplateId: (
            state,
            action: PayloadAction<string>,
        ) => {
            state.selectedTemplateId = action.payload
        },
    },
})

export const cvReviewLevelReducer = cvReviewLevelSlice.reducer
export const {
    setSelectedCvReviewTemplateId,
} = cvReviewLevelSlice.actions
