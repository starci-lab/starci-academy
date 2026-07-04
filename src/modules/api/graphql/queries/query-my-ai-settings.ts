import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyAiSettingsResponse } from "./types"

/** Provider serving a concrete model (mirrors backend `ModelProvider`). */
export enum ModelProvider {
    Gemini = "gemini",
    OpenAI = "openai",
    Local = "local",
    OpenRouter = "openrouter",
    Anthropic = "anthropic",
}

/** Paid subscription tier (mirrors backend `AiSubTier`). */
export enum AiSubTier {
    Plus = "plus",
    Pro = "pro",
    Max = "max",
}

const query1 = gql`
  query MyAiSettings {
    myAiSettings {
      success
      message
      error
      data {
        canPremium
        tier
      }
    }
  }
`

export enum QueryMyAiSettings {
    Query1 = "query1",
}

const queryMap: Record<QueryMyAiSettings, DocumentNode> = {
    [QueryMyAiSettings.Query1]: query1,
}

/**
 * Fetches the current user's AI capabilities: whether paid-tier models are
 * unlocked (`canPremium` = paid OR enrolled) and the active paid `tier`.
 *
 * Mirrors `myAiSettings` (queries/ai/my-ai-settings.resolver.ts).
 */
export const queryMyAiSettings = async ({
    query = QueryMyAiSettings.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryMyAiSettings, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyAiSettingsResponse>({
        query: queryMap[query],
    })
}
