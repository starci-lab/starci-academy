import type {
    AiMode,
    ModelProvider,
} from "@/modules/api"

/** One selectable BYOK provider option (API value + display label). */
export interface ByokProviderOption {
    /** Provider enum value sent to the API. */
    value: ModelProvider
    /** Human-readable label shown on the button. */
    label: string
}

/** One lane row in the selector (lane + whether it is locked). */
export interface AiLaneChoice {
    /** The lane this row represents. */
    mode: AiMode
    /** True when the user cannot pick it (e.g. Premium without subscription). */
    disabled: boolean
}
