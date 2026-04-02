import { ChallengeEntity, ContentEntity } from "@/modules/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The data for the content modal.
 */
export interface ContentModalData {
    /** The content. */
    data: ContentEntity
}

/**
 * The data for the challenge modal.
 */
export interface ChallengeModalData {
    /** The challenge. */
    data: ChallengeEntity
}

/**
 * Modal-related UI state (content reader, challenge detail, etc.).
 */
export interface ModalSlice {
    data?: ContentModalData
    challengeData?: ChallengeModalData
}

const initialState: ModalSlice = {
    data: undefined,
    challengeData: undefined,
}

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setContentModalData: (
            state,
            action: PayloadAction<ContentModalData>
        ) => {
            state.data = action.payload
        },
        setChallengeModalData: (
            state,
            action: PayloadAction<ChallengeModalData>
        ) => {
            state.challengeData = action.payload
        },
    },
})

export const modalReducer = modalSlice.reducer

export const {
    setContentModalData,
    setChallengeModalData,
} = modalSlice.actions
