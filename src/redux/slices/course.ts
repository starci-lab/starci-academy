import type {
    CourseEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the course.
 */
export interface CourseSlice {
    /** The course display id. */
    displayId?: string
    /** The course entity. */
    entity?: CourseEntity
    /** The course id. */
    id?: string
    /** The course entities */
    entities?: Array<CourseEntity>
}

/**
 * The initial state of the course slice.
 */
const initialState: CourseSlice = {
    /** The course display id. */
    displayId: undefined,
    /** The course entity. */
    entity: undefined,
    /** The course id. */
    id: undefined,
    /** The course entities. */
    entities: [],
}

/**
 * The slice for the course.
 */
export const courseSlice = createSlice(
    {
        /** The name of the slice. */
        name: "course",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the course. */
            setCourse: (
                state, 
                action: PayloadAction<CourseEntity | undefined>
            ) => {
                state.entity = action.payload
            },
            /** The action to set the courses. */
            setCourses: (
                state, 
                action: PayloadAction<Array<CourseEntity>>
            ) => {
                state.entities = action.payload
            },
            /** The action to set the course id. */
            setCourseDisplayId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.displayId = action.payload
            },
            /** The action to set the course id. */
            setCourseId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
        },
    }
)

/**
 * The reducer for the course slice.
 */
export const courseReducer = courseSlice.reducer
export const { 
    setCourse,
    setCourses,
    setCourseDisplayId,
    setCourseId,
} = courseSlice.actions