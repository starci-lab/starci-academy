import type {
    ByokProviderOption,
} from "../types"
import { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"

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
