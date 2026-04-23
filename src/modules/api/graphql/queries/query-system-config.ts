import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
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
}: QueryParams<QuerySystemConfig, undefined>) => {
    const apollo = createApolloClient({
        cache: false,
        debug,
    })
    return apollo.query<QuerySystemConfigResponse>({
        query: queryMap[query],
    })
}
