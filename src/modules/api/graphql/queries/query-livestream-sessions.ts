import type { LivestreamSessionEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `livestreamSessions` (`LivestreamSessionsSortBy`). */
export enum LivestreamSessionsSortBy {
    OrderIndex = "orderIndex",
    DayOfWeek = "dayOfWeek",
    StartTime = "startTime",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryLivestreamSessionsPayload {
    count: number
    data: Array<LivestreamSessionEntity>
}

const query1 = gql`
  query LivestreamSessions($request: LivestreamSessionsRequest!) {
    livestreamSessions(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          dayOfWeek
          startTime
          expectedEndTime
          note
          orderIndex
        }
      }
    }
  }
`

export enum QueryLivestreamSessions {
    Query1 = "query1",
}

const queryMap: Record<QueryLivestreamSessions, DocumentNode> = {
    [QueryLivestreamSessions.Query1]: query1,
}

export type LivestreamSessionsListFilters = PaginationFilters<LivestreamSessionsSortBy>

export interface LivestreamSessionsListRequest {
    courseId: string
    filters: LivestreamSessionsListFilters
}

export interface QueryLivestreamSessionsResponse {
    livestreamSessions: GraphQLResponse<QueryLivestreamSessionsPayload>
}

export const defaultLivestreamSessionsListSorts: Array<SortInput<LivestreamSessionsSortBy>> = [
    {
        by: LivestreamSessionsSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated course livestream sessions (`ref/livestream-sessions`).
 */
export const queryLivestreamSessions = async ({
    query = QueryLivestreamSessions.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryLivestreamSessions, LivestreamSessionsListRequest>) => {
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

    return apollo.query<QueryLivestreamSessionsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
