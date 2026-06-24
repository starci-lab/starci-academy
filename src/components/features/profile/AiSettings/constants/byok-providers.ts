import {
    ModelProvider,
} from "@/modules/api"
import type {
    ByokProviderOption,
} from "../types"

/** BYOK providers a user can bring their own key for, in display order. */
export const BYOK_PROVIDERS: Array<ByokProviderOption> = [
    {
        value: ModelProvider.OpenAI,
        label: "OpenAI",
    },
    {
        value: ModelProvider.Gemini,
        label: "Google Gemini",
    },
]
