import { 
    CourseEntity,
    ModuleEntity
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the course.
 */
export interface CourseSlice {
    /** The course id. */
    id?: string
    /** The course. */
    course?: CourseEntity
    /** The courses. */
    courses: Array<CourseEntity>
    /** The module id. */
    moduleId?: string
    /** The module. */
    module?: ModuleEntity
}

/**
 * The initial state of the course slice.
 */
const initialState: CourseSlice = {
    /** The course id. */
    id: undefined,
    /** The course. */
    course: undefined,
    /** The courses. */
    courses: [],
    /** The module id. */
    moduleId: undefined,
    /** The module. */
    module: undefined,
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
                state.course = action.payload
            },
            /** The action to set the courses. */
            setCourses: (
                state, 
                action: PayloadAction<Array<CourseEntity>>
            ) => {
                state.courses = action.payload
            },
            /** The action to set the course id. */
            setCourseId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the module id. */
            setModuleId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.moduleId = action.payload
            },
            /** The action to set the module. */
            setModule: (
                state, 
                action: PayloadAction<ModuleEntity | undefined>
            ) => {
                state.module = action.payload
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
    setCourseId,
    setModuleId,
    setModule,
} = courseSlice.actions