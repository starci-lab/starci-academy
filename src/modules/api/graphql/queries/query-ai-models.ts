import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query AiModels {
    aiModels {
      success
      message
      error
      data {
        tier
        models {
          taskKind
          label
          description
          activeModel {
            model
            provider
          }
          fallbackChain {
            model
            provider
          }
        }
      }
    }
  }
`

export enum QueryAiModels {
    Query1 = "query1",
}

const queryMap: Record<QueryAiModels, DocumentNode> = {
    [QueryAiModels.Query1]: query1,
}

export interface AiModelChoice {
    model: string
    provider: string
}

export interface AiActiveModel {
    taskKind: string
    label: string
    description: string
    activeModel: AiModelChoice
    fallbackChain: Array<AiModelChoice>
}

export interface QueryAiModelsResponseData {
    tier: string
    models: Array<AiActiveModel>
}

export interface QueryAiModelsResponse {
    aiModels: GraphQLResponse<QueryAiModelsResponseData>
}

export const queryAiModels = async ({
    query = QueryAiModels.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryAiModels, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryAiModelsResponse>({
        query: queryMap[query],
    })
}
