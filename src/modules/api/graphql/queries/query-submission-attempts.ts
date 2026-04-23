import type { SubmissionAttemptEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `lessonVideos` list (`LessonVideosSortBy`). */
export enum SubmissionAttemptsSortBy {
    // The attempt number.
    AttemptNumber = "attemptNumber",
    // The date and time the attempt was processed.
    ProccesedAt = "proccesedAt",
    // The score of the attempt.
    Score = "score",
    // The date and time the attempt was created.
    CreatedAt = "createdAt",
    // The date and time the attempt was updated.
    UpdatedAt = "updatedAt",
}

export interface QuerySubmissionAttemptsPayload {
    count: number
    data: Array<SubmissionAttemptEntity>
}

const query1 = gql`
  query SubmissionAttempts($request: SubmissionAttemptsRequest!) {
    submissionAttempts(request: $request) {
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
          processedAt
          submissionUrl
        }
      }
    }
  }
`

export enum QuerySubmissionAttempts {
    Query1 = "query1",
}

const queryMap: Record<QuerySubmissionAttempts, DocumentNode> = {
    [QuerySubmissionAttempts.Query1]: query1,
}

export type SubmissionAttemptsListFilters = PaginationFilters<SubmissionAttemptsSortBy>

export interface SubmissionAttemptsListRequest {
    challengeSubmissionId: string
    filters: SubmissionAttemptsListFilters
}

export interface QuerySubmissionAttemptsResponse {
    submissionAttempts: GraphQLResponse<QuerySubmissionAttemptsPayload>
}

export const defaultSubmissionAttemptsListSorts: Array<SortInput<SubmissionAttemptsSortBy>> = [
    {
        by: SubmissionAttemptsSortBy.AttemptNumber,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated submission attempts (`ref/queries/submission-attempts/submission-attempts`).
 */
export const querySubmissionAttempts = async ({
    query = QuerySubmissionAttempts.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: QueryParams<QuerySubmissionAttempts, SubmissionAttemptsListRequest>) => {
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
    })

    return apollo.query<QuerySubmissionAttemptsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
