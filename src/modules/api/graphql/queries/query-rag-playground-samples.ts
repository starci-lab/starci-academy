import { createNoAuthApolloClient } from "../clients/clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryRagPlaygroundSamplesResponse } from "./types"

const query1 = gql`
  query RagPlaygroundSamples {
    ragPlaygroundSamples {
      success
      message
      error
      data {
        id
        label
      }
    }
  }
`

export enum QueryRagPlaygroundSamples {
    Query1 = "query1",
}

const queryMap: Record<QueryRagPlaygroundSamples, DocumentNode> = {
    [QueryRagPlaygroundSamples.Query1]: query1,
}

/**
 * Fetches the public RAG Playground's built-in sample catalog (no auth) for
 * the Sample-tab picker. Mirrors backend `queries/rag-playground-samples`.
 */
export const queryRagPlaygroundSamples = async ({
    query = QueryRagPlaygroundSamples.Query1,
    debug,
    signal,
}: QueryParams<QueryRagPlaygroundSamples, undefined>) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryRagPlaygroundSamplesResponse>({
        query: queryMap[query],
    })
}
