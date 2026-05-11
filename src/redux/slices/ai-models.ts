import type { AiActiveModel } from "@/modules/api/graphql/queries/query-ai-models"
import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

export interface AiModelsSlice {
    tier?: string
    models: Array<AiActiveModel>
}

const initialState: AiModelsSlice = {
    models: [],
}

export const aiModelsSlice = createSlice(
    {
        name: "aiModels",
        initialState,
        reducers: {
            setAiModels: (
                state,
                action: PayloadAction<{ tier: string; models: Array<AiActiveModel> }>,
            ) => {
                state.tier = action.payload.tier
                state.models = action.payload.models
            },
        },
    },
)

export const aiModelsReducer = aiModelsSlice.reducer
export const { setAiModels } = aiModelsSlice.actions
