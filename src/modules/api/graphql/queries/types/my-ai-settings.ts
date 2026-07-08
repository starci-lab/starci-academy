import type { GraphQLResponse } from "../../types"
import type {
    AiSubTier,
} from "../query-my-ai-settings"

/** Payload inside `myAiSettings.data` after the standard API wrapper. */
export interface QueryMyAiSettingsResponseData {
    /** Whether the user may use paid-tier models (paid OR enrolled). */
    canPremium: boolean
    /** The user's active paid subscription tier; null when on the free tier. */
    tier: AiSubTier | null
}

/** Apollo response shape for the `myAiSettings` query. */
export interface QueryMyAiSettingsResponse {
    /** Top-level `myAiSettings` field wrapping the standard API response. */
    myAiSettings: GraphQLResponse<QueryMyAiSettingsResponseData>
}
