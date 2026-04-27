import type { UserEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import { withAbortContext, type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Me {
    me {
      success
      message
      error
      data {
        id
        email
        avatar
        username
      }
    }
  }
`

export enum QueryMe {
    Query1 = "query1",
}

const queryMap: Record<QueryMe, DocumentNode> = {
    [QueryMe.Query1]: query1,
}

export interface QueryMeResponse {
    me: GraphQLResponse<UserEntity>
}

/**
 * Fetches the current user via Apollo.
 *
 * @param params - Document key, GraphQL variables, and optional bearer token
 * @returns Apollo query result; entity at `data.me.data.data`
 */
export const queryMe = async ({
    query = QueryMe.Query1,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryMe, undefined>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient({
        auth: hasAuth,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        debug,
    })

    return apollo.query<QueryMeResponse>({
        query: queryMap[query],
        ...withAbortContext(signal),
    })
}
