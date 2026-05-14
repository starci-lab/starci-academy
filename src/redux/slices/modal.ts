import { ChallengeEntity, ContentEntity, JobCategory } from "@/modules/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AIProcessingModalData {
    /** Optional `jobs.id` for flows that track a single async job. */
    jobId?: string
    /** Optional `jobs.category` for flows that track a single async job. */
    category?: JobCategory
}

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
    aiProcessingData?: AIProcessingModalData
}

const initialState: ModalSlice = {
    data: undefined,
    challengeData: undefined,
    aiProcessingData: undefined,
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
        setAiProcessingModalData: (
            state,
            action: PayloadAction<AIProcessingModalData>
        ) => {
            state.aiProcessingData = action.payload
        },
    },
})

export const modalReducer = modalSlice.reducer

export const {
    setContentModalData,
    setChallengeModalData,
    setAiProcessingModalData,
} = modalSlice.actions
