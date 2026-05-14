import { createAuthApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import { UserMilestoneTaskAttemptFeedbackEntity } from "@/modules/types"

/** Sort keys for `userMilestoneTaskFeedbacks` list. */
export enum UserMilestoneTaskFeedbacksSortBy {
    OrderIndex = "orderIndex",
    Severity = "severity",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryUserMilestoneTaskFeedbacksPayload {
    count: number
    data: Array<UserMilestoneTaskAttemptFeedbackEntity>
}

const query1 = gql`
  query UserMilestoneTaskFeedbacks($request: UserMilestoneTaskFeedbacksRequest!) {
    userMilestoneTaskFeedbacks(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          message
          severity
          orderIndex
          location
          suggestion
        }
      }
    }
  }
`

export enum QueryUserMilestoneTaskFeedbacks {
    Query1 = "query1",
}

const queryMap: Record<QueryUserMilestoneTaskFeedbacks, DocumentNode> = {
    [QueryUserMilestoneTaskFeedbacks.Query1]: query1,
}

export type UserMilestoneTaskFeedbacksListFilters = PaginationFilters<UserMilestoneTaskFeedbacksSortBy>

export interface UserMilestoneTaskFeedbacksListRequest {
    courseId: string
    taskId: string
    filters: UserMilestoneTaskFeedbacksListFilters
}

export interface QueryUserMilestoneTaskFeedbacksResponse {
    userMilestoneTaskFeedbacks: GraphQLResponse<QueryUserMilestoneTaskFeedbacksPayload>
}

export const defaultUserMilestoneTaskFeedbacksListSorts: Array<SortInput<UserMilestoneTaskFeedbacksSortBy>> = [
    {
        by: UserMilestoneTaskFeedbacksSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated feedback rows for the authenticated user’s latest attempt on a milestone task.
 */
export const queryUserMilestoneTaskFeedbacks = async ({
    query = QueryUserMilestoneTaskFeedbacks.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryUserMilestoneTaskFeedbacks, UserMilestoneTaskFeedbacksListRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryUserMilestoneTaskFeedbacksResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
