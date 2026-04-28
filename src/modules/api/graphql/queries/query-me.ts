import type { UserEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
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
 * @param params - Document key, GraphQL variables
 * @returns Apollo query result; entity at `data.me.data.data`
 */
export const queryMe = async ({
    query = QueryMe.Query1,
    debug,
    signal,
}: QueryParams<QueryMe, undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryMeResponse>({
        query: queryMap[query],
    })
}
