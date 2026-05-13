import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"
import type { CvUrlPayload } from "@/modules/types"

/**
 * Redux state for the current user's CV presigned view URL (`cvUrl` query).
 */
export interface CvUrlSlice {
    /** Latest `cvUrl` query payload for the signed-in user, or null if none. */
    entity: CvUrlPayload | null
}

const initialState: CvUrlSlice = {
    entity: null,
}

export const cvUrlSlice = createSlice({
    name: "cvUrl",
    initialState,
    reducers: {
        setCvUrl: (
            state,
            action: PayloadAction<CvUrlPayload | null>,
        ) => {
            state.entity = action.payload
        },
    },
})

export const cvUrlReducer = cvUrlSlice.reducer
export const {
    setCvUrl,
} = cvUrlSlice.actions
