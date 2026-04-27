import type { ChallengeEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `challenges` list (`ChallengesSortBy`). */
export enum ChallengesSortBy {
    Title = "title",
    OrderIndex = "orderIndex",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryChallengesPayload {
    count: number
    data: Array<ChallengeEntity>
}

const query1 = gql`
  query Challenges($request: ChallengesRequest!) {
    challenges(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          title
          requirements
          description
          score
          difficulty
          orderIndex
          steps {
            id
          }
        }
      }
    }
  }
`

export enum QueryChallenges {
    Query1 = "query1",
}

const queryMap: Record<QueryChallenges, DocumentNode> = {
    [QueryChallenges.Query1]: query1,
}

export type ChallengesListFilters = PaginationFilters<ChallengesSortBy>

export interface ChallengesListRequest {
    filters: ChallengesListFilters
    contentId: string
}

export interface QueryChallengesResponse {
    challenges: GraphQLResponse<QueryChallengesPayload>
}

export const defaultChallengesListSorts: Array<SortInput<ChallengesSortBy>> = [
    {
        by: ChallengesSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated content challenges (`ref/queries/challenges/challenges`).
 */
export const queryChallenges = async ({
    query = QueryChallenges.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryChallenges, ChallengesListRequest>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient({
        auth: hasAuth,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryChallengesResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
