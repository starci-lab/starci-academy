import type { SystemConfigData } from "@/modules/api/graphql/queries/query-system-config"
import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit"

/**
 * App-wide system settings from the API (`querySystemConfig` / mounted `app.json`).
 */
export interface SystemSlice {
    /**
     * Challenge-related config (pass threshold, etc.). Undefined until the first successful fetch.
     */
    config?: SystemConfigData
}

const initialState: SystemSlice = {}

export const systemSlice = createSlice(
    {
        name: "system",
        initialState,
        reducers: {
            setSystemConfig: (
                state,
                action: PayloadAction<SystemConfigData | undefined>,
            ) => {
                state.config = action.payload
            },
        },
    },
)

export const systemReducer = systemSlice.reducer
export const { setSystemConfig } = systemSlice.actions
