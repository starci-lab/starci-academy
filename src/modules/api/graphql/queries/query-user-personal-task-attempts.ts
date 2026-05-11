
import type { PersonalFeedbackAttempt } from "./query-personal-feedbacks"
import { createAuthApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `userPersonalTaskAttempts` list. */
export enum UserPersonalTaskAttemptsSortBy {
    AttemptNumber = "attemptNumber",
    Score = "score",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
    ProcessedAt = "processedAt",
}

export interface QueryUserPersonalTaskAttemptsPayload {
    count: number
    data: Array<PersonalFeedbackAttempt>
}

const query1 = gql`
  query UserPersonalTaskAttempts($request: UserPersonalTaskAttemptsRequest!) {
    userPersonalTaskAttempts(request: $request) {
      success
      message
      error
      data {
        count
        data {
          id
          attemptNumber
          score
          shortFeedback
          submissionUrl
          processedAt
        }
      }
    }
  }
`

export enum QueryUserPersonalTaskAttempts {
    Query1 = "query1",
}

const queryMap: Record<QueryUserPersonalTaskAttempts, DocumentNode> = {
    [QueryUserPersonalTaskAttempts.Query1]: query1,
}

export type UserPersonalTaskAttemptsListFilters = PaginationFilters<UserPersonalTaskAttemptsSortBy>

export interface UserPersonalTaskAttemptsListRequest {
    courseId: string
    taskId: string
    filters: UserPersonalTaskAttemptsListFilters
}

export interface QueryUserPersonalTaskAttemptsResponse {
    userPersonalTaskAttempts: GraphQLResponse<QueryUserPersonalTaskAttemptsPayload>
}

export const defaultUserPersonalTaskAttemptsListSorts: Array<SortInput<UserPersonalTaskAttemptsSortBy>> = [
    {
        by: UserPersonalTaskAttemptsSortBy.AttemptNumber,
        order: SortOrder.Desc,
    },
]

/**
 * Paginated user personal task attempts.
 */
export const queryUserPersonalTaskAttempts = async ({
    query = QueryUserPersonalTaskAttempts.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryUserPersonalTaskAttempts, UserPersonalTaskAttemptsListRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryUserPersonalTaskAttemptsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
