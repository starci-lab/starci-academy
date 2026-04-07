import type { LivestreamSessionEntity } from "@/modules/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

/**
 * Livestream session list for the current course (Learn tab calendar).
 */
export interface LivestreamSessionSlice {
    entities?: Array<LivestreamSessionEntity>
    count?: number
    pageNumber: number
    limit: number
}

const initialState: LivestreamSessionSlice = {
    entities: [],
    count: undefined,
    pageNumber: 0,
    limit: 50,
}

export const livestreamSessionSlice = createSlice({
    name: "livestreamSession",
    initialState,
    reducers: {
        setLivestreamSessions: (
            state,
            action: PayloadAction<Array<LivestreamSessionEntity>>,
        ) => {
            state.entities = action.payload
        },
        setLivestreamSessionsCount: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            state.count = action.payload
        },
        setLivestreamSessionsPageNumber: (
            state,
            action: PayloadAction<number>,
        ) => {
            state.pageNumber = action.payload
        },
        setLivestreamSessionsLimit: (
            state,
            action: PayloadAction<number>,
        ) => {
            state.limit = action.payload
        },
    },
})

export const livestreamSessionReducer = livestreamSessionSlice.reducer
export const {
    setLivestreamSessions,
    setLivestreamSessionsCount,
    setLivestreamSessionsPageNumber,
    setLivestreamSessionsLimit,
} = livestreamSessionSlice.actions
