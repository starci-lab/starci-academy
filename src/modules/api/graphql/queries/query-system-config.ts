import { createNoAuthApolloClient } from "../clients/clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/**
 * Mounted `systemConfig` payload (GraphQL: `systemChallengeConfig.data`).
 */
export interface SystemConfigData {
    challenge: {
        /** Minimum score (0–1) required to pass a challenge. */
        passThreshold: number
    }
}

const query1 = gql`
  query SystemConfig {
    systemConfig {
      success
      message
      error
      data {
        challenge {
          passThreshold
        }
      }
    }
  }
`

export enum QuerySystemConfig {
    Query1 = "query1",
}

const queryMap: Record<QuerySystemConfig, DocumentNode> = {
    [QuerySystemConfig.Query1]: query1,
}

export interface QuerySystemConfigResponse {
    systemConfig: GraphQLResponse<SystemConfigData>
}

/**
 * Fetches public system config (no auth). Resolver name remains `systemConfig`.
 */
export const querySystemConfig = async ({
    query = QuerySystemConfig.Query1,
    debug,
    signal,
}: QueryParams<QuerySystemConfig, undefined>) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QuerySystemConfigResponse>({
        query: queryMap[query],
    })
}
