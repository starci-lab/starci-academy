import type {
    LessonVideoEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the lesson video.
 */
export interface LessonVideoSlice {
    /** The lesson video display id. */
    displayId?: string
    /** The lesson video entity. */
    entity?: LessonVideoEntity
    /** The lesson video id. */
    id?: string
    /** The lesson video entities */
    entities?: Array<LessonVideoEntity>
    /** The lesson video page number. */
    pageNumber?: number
    /** The lesson video limit. */
    limit?: number
    /** The lesson video count. */
    count?: number
}

/**
 * The initial state of the lesson video slice.
 */
const initialState: LessonVideoSlice = {
    /** The lesson video display id. */
    displayId: undefined,
    /** The lesson video entity. */
    entity: undefined,
    /** The lesson video id. */
    id: undefined,
    /** The lesson video entities. */
    entities: [],
    /** The lesson video page number. */
    pageNumber: undefined,
    /** The lesson video limit. */
    limit: undefined,
    /** The lesson video count. */
    count: undefined,
}

/**
 * The slice for the lesson video.
 */
export const lessonVideoSlice = createSlice(
    {
        /** The name of the slice. */
        name: "lessonVideo",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the lesson video. */
            setLessonVideo: (
                state, 
                action: PayloadAction<LessonVideoEntity | undefined>
            ) => {
                state.entity = action.payload
            },
            /** The action to set the lesson videos. */
            setLessonVideos: (
                state, 
                action: PayloadAction<Array<LessonVideoEntity>>
            ) => {
                state.entities = action.payload
            },
            /** The action to set the lesson video display id. */
            setLessonVideoDisplayId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.displayId = action.payload
            },
            /** The action to set the lesson video id. */
            setLessonVideoId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the lesson video page number. */
            setLessonVideoPageNumber: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.pageNumber = action.payload
            },
            /** The action to set the lesson video limit. */
            setLessonVideoLimit: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.limit = action.payload
            },
            /** The action to set the lesson video count. */
            setLessonVideoCount: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.count = action.payload
            },
        },
    }
)

/**
 * The reducer for the lesson video slice.
 */
export const lessonVideoReducer = lessonVideoSlice.reducer
export const { 
    setLessonVideo,
    setLessonVideos,
    setLessonVideoDisplayId,
    setLessonVideoId,
    setLessonVideoPageNumber,
    setLessonVideoLimit,
    setLessonVideoCount,
} = lessonVideoSlice.actions