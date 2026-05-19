import type {
    FoundationCategoryEntity,
    FoundationEntity,
} from "@/modules/types"
import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit"

export interface FoundationSlice {
    /** Selected category id (from URL). */
    categoryId?: string
    /** Selected foundation id (detail route). */
    foundationId?: string
    /** Selected category entity. */
    category?: FoundationCategoryEntity
    /** Selected foundation entity (detail view). */
    entity?: FoundationEntity
    /** All categories from `foundationCategories` query. */
    categories?: Array<FoundationCategoryEntity>
    /** Foundations for the active category. */
    entities?: Array<FoundationEntity>
    /** Total foundations count for pagination. */
    count?: number
    /** Current page number (1-based). */
    pageNumber?: number
    /** Page size. */
    limit?: number
}

const initialState: FoundationSlice = {
    categoryId: undefined,
    foundationId: undefined,
    category: undefined,
    entity: undefined,
    categories: undefined,
    entities: undefined,
    count: undefined,
    pageNumber: 1,
    limit: 100,
}

export const foundationSlice = createSlice({
    name: "foundation",
    initialState,
    reducers: {
        setFoundationCategoryId: (
            state,
            action: PayloadAction<string | undefined>,
        ) => {
            state.categoryId = action.payload
        },
        setFoundationId: (
            state,
            action: PayloadAction<string | undefined>,
        ) => {
            state.foundationId = action.payload
        },
        setFoundation: (
            state,
            action: PayloadAction<FoundationEntity | undefined>,
        ) => {
            state.entity = action.payload
        },
        setFoundationCategory: (
            state,
            action: PayloadAction<FoundationCategoryEntity | undefined>,
        ) => {
            state.category = action.payload
        },
        setFoundationCategories: (
            state,
            action: PayloadAction<Array<FoundationCategoryEntity> | undefined>,
        ) => {
            state.categories = action.payload
        },
        setFoundations: (
            state,
            action: PayloadAction<Array<FoundationEntity> | undefined>,
        ) => {
            state.entities = action.payload
        },
        setFoundationsCount: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            state.count = action.payload
        },
        setFoundationPageNumber: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            state.pageNumber = action.payload
        },
        setFoundationLimit: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            state.limit = action.payload
        },
    },
})

export const foundationReducer = foundationSlice.reducer
export const {
    setFoundationCategoryId,
    setFoundationId,
    setFoundation,
    setFoundationCategory,
    setFoundationCategories,
    setFoundations,
    setFoundationsCount,
    setFoundationPageNumber,
    setFoundationLimit,
} = foundationSlice.actions
