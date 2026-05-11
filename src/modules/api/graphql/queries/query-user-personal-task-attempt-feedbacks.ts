
import type { PersonalFeedbackItem } from "./query-personal-feedbacks"
import { createAuthApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `userPersonalTaskAttemptFeedbacks` list. */
export enum UserPersonalTaskAttemptFeedbacksSortBy {
    OrderIndex = "orderIndex",
    Severity = "severity",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryUserPersonalTaskAttemptFeedbacksPayload {
    count: number
    data: Array<PersonalFeedbackItem>
}

const query1 = gql`
  query UserPersonalTaskAttemptFeedbacks($request: UserPersonalTaskAttemptFeedbacksRequest!) {
    userPersonalTaskAttemptFeedbacks(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          message
          detail
          severity
          orderIndex
          location
          suggestion
        }
      }
    }
  }
`

export enum QueryUserPersonalTaskAttemptFeedbacks {
    Query1 = "query1",
}

const queryMap: Record<QueryUserPersonalTaskAttemptFeedbacks, DocumentNode> = {
    [QueryUserPersonalTaskAttemptFeedbacks.Query1]: query1,
}

export type UserPersonalTaskAttemptFeedbacksListFilters = PaginationFilters<UserPersonalTaskAttemptFeedbacksSortBy>

export interface UserPersonalTaskAttemptFeedbacksListRequest {
    attemptId: string
    filters: UserPersonalTaskAttemptFeedbacksListFilters
}

export interface QueryUserPersonalTaskAttemptFeedbacksResponse {
    userPersonalTaskAttemptFeedbacks: GraphQLResponse<QueryUserPersonalTaskAttemptFeedbacksPayload>
}

export const defaultUserPersonalTaskAttemptFeedbacksListSorts: Array<SortInput<UserPersonalTaskAttemptFeedbacksSortBy>> = [
    {
        by: UserPersonalTaskAttemptFeedbacksSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated user personal task attempt feedbacks.
 */
export const queryUserPersonalTaskAttemptFeedbacks = async ({
    query = QueryUserPersonalTaskAttemptFeedbacks.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryUserPersonalTaskAttemptFeedbacks, UserPersonalTaskAttemptFeedbacksListRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryUserPersonalTaskAttemptFeedbacksResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
