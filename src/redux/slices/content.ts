import type {
    ContentEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the content.
 */
export interface ContentSlice {
    /** When set, `useQueryContentSwr` fetches this row (`content` query). */
    id?: string
    /** The content entity. */
    entity?: ContentEntity
    /** The contents entities. */
    entities?: Array<ContentEntity>
    /** The contents page number. */
    pageNumber?: number
    /** The contents limit. */
    limit?: number
    /** The contents count. */
    count?: number
}

/**
 * The initial state of the content slice.
 */
const initialState: ContentSlice = {
    /** When set, `useQueryContentSwr` fetches this row (`content` query). */
    id: undefined,
    /** The content. */
    entity: undefined,
    /** The contents entities. */
    entities: [],
    /** The contents page number. */
    pageNumber: undefined,
    /** The contents limit. */
    limit: undefined,
    /** The contents count. */
    count: undefined,
}

/**
 * The slice for the content.
 */
export const contentSlice = createSlice(
    {
        /** The name of the slice. */
        name: "content",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the content. */
            setContent: (
                state, 
                action: PayloadAction<ContentEntity | undefined>
            ) => {
                state.entity = action.payload
            },
            /** The action to set the contents. */
            setContents: (
                state, 
                action: PayloadAction<Array<ContentEntity>>
            ) => {
                state.entities = action.payload
            },
            /** The action to set the content id. */
            setContentId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the content page number. */
            setContentPageNumber: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.pageNumber = action.payload
            },
            /** The action to set the content limit. */
            setContentLimit: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.limit = action.payload
            },
            /** The action to set the contents count. */
            setContentsCount: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.count = action.payload
            },
        },
    }
)

/**
 * The reducer for the content slice.
 */
export const contentReducer = contentSlice.reducer
export const { 
    setContent,
    setContents,
    setContentId,
    setContentPageNumber,
    setContentLimit,
    setContentsCount,
} = contentSlice.actions