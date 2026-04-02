import type {
    ModuleEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for the content.
 */
export interface ModuleSlice {
    /** When set, `useQueryModuleSwr` fetches this row (`module` query). */
    id?: string
    /** The module display id. */
    displayId?: string
    /** The module entity. */
    entity?: ModuleEntity
    /** The contents page number. */
    pageNumber?: number
    /** The contents limit. */
    limit?: number
}

/**
 * The initial state of the content slice.
 */
const initialState: ModuleSlice = {
    /** When set, `useQueryModuleSwr` fetches this row (`module` query). */
    id: undefined,
    /** The module display id. */
    displayId: undefined,
    /** The module entity. */
    entity: undefined,
    /** The modules page number. */
    pageNumber: undefined,
    /** The modules limit. */
    limit: undefined,
}

/**
 * The slice for the module.
 */
export const moduleSlice = createSlice(
    {
        /** The name of the slice. */
        name: "module",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the module. */
            setModule: (
                state, 
                action: PayloadAction<ModuleEntity | undefined>
            ) => {
                state.entity = action.payload
            },
            /** The action to set the module display id. */
            setModuleDisplayId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.displayId = action.payload
            },
            /** The action to set the module id. */
            setModuleId: (
                state, 
                action: PayloadAction<string | undefined>
            ) => {
                state.id = action.payload
            },
            /** The action to set the module page number. */
            setModulePageNumber: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.pageNumber = action.payload
            },
            /** The action to set the modules limit. */
            setModuleLimit: (
                state,
                action: PayloadAction<number | undefined>,
            ) => {
                state.limit = action.payload
            },
        },
    }
)

/**
 * The reducer for the module slice.
 */
export const moduleReducer = moduleSlice.reducer
export const { 
    setModule,
    setModuleDisplayId,
    setModuleId,
    setModulePageNumber,
    setModuleLimit,
} = moduleSlice.actions