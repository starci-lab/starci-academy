import type {
    MilestoneEntity,
} from "@/modules/types"
import { 
    createSlice, 
    PayloadAction 
} from "@reduxjs/toolkit"

/**
 * The slice for milestones.
 */
export interface MilestoneSlice {
    /** The milestone entities for the current course. */
    entities: Array<MilestoneEntity>
}

/**
 * The initial state of the milestone slice.
 */
const initialState: MilestoneSlice = {
    /** The milestone entities. */
    entities: [],
}

/**
 * The slice for milestones.
 */
export const milestoneSlice = createSlice(
    {
        /** The name of the slice. */
        name: "milestone",
        /** The initial state of the slice. */
        initialState,
        /** The reducers of the slice. */
        reducers: {
            /** The action to set the milestones. */
            setMilestones: (
                state, 
                action: PayloadAction<Array<MilestoneEntity>>
            ) => {
                state.entities = action.payload
            },
        },
    }
)

/**
 * The reducer for the milestone slice.
 */
export const milestoneReducer = milestoneSlice.reducer
export const { 
    setMilestones,
} = milestoneSlice.actions
