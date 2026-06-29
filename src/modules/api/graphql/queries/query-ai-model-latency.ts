import { createNoAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryAiModelLatencyResponse } from "./types"

const query1 = gql`
  query AiModelLatency {
    aiModelLatency {
      success
      message
      error
      data {
        models {
          name
          provider
          category
          ok
          latencyMs
          checkedAt
          errorMessage
        }
      }
    }
  }
`

export enum QueryAiModelLatency {
    Query1 = "query1",
}

const queryMap: Record<QueryAiModelLatency, DocumentNode> = {
    [QueryAiModelLatency.Query1]: query1,
}

/**
 * Public per-model AI latency snapshot — one up/down + latency row per enabled
 * model, used to render the live health indicator in the model pickers. No auth:
 * carries no raw keys (per-key health stays behind admin `aiBalancerHealth`).
 *
 * Mirrors `aiModelLatency` (queries/system/ai-model-latency).
 */
export const queryAiModelLatency = async ({
    query = QueryAiModelLatency.Query1,
    debug,
    signal,
}: Omit<QueryParams<QueryAiModelLatency, never>, "request" | "headers"> & {
    request?: never
}) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryAiModelLatencyResponse>({
        query: queryMap[query],
    })
}
