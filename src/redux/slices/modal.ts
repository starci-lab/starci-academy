import { ChallengeEntity, ContentEntity } from "@/modules/types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export enum AIProcessingModalKind {
    Task = "task",
    Challenge = "challenge",
}

export interface AIProcessingModalData {
    kind: AIProcessingModalKind
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
        setAIProcessingModalData: (
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
    setAIProcessingModalData,
} = modalSlice.actions
