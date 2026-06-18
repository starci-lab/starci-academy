import type {
    ModelProvider,
} from "@/modules/api"

/** One selectable BYOK provider option (API value + display label). */
export interface ByokProviderOption {
    /** Provider enum value sent to the API. */
    value: ModelProvider
    /** Human-readable label shown on the button. */
    label: string
}
