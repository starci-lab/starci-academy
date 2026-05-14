import type { TemplateCVEntity } from "@/modules/api"
import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

/**
 * Redux mirror of the `templateCvs` GraphQL query (rubric rows for CV review).
 */
export interface TemplateCvsSlice {
    /** Latest template CV rows returned by the API. */
    rows: Array<TemplateCVEntity>
}

const initialState: TemplateCvsSlice = {
    rows: [],
}

export const templateCvsSlice = createSlice({
    name: "templateCvs",
    initialState,
    reducers: {
        setTemplateCvs: (
            state,
            action: PayloadAction<Array<TemplateCVEntity>>,
        ) => {
            state.rows = action.payload
        },
    },
})

export const templateCvsReducer = templateCvsSlice.reducer
export const { setTemplateCvs } = templateCvsSlice.actions
