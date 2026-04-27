import type { SubmissionFeedbackEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `submissionFeedbacks` list (`SubmissionFeedbacksSortBy`). */
export enum SubmissionFeedbacksSortBy {
    // The date and time the submission feedback was created.
    CreatedAt = "createdAt",
    // The date and time the submission feedback was updated.
    UpdatedAt = "updatedAt",
    // The severity of the submission feedback.
    Severity = "severity",
    // The order index of the submission feedback.
    OrderIndex = "orderIndex",
}

export interface QuerySubmissionFeedbacksPayload {
    count: number
    data: Array<SubmissionFeedbackEntity>
}

const query1 = gql`
  query SubmissionFeedbacks($request: SubmissionFeedbacksRequest!) {
    submissionFeedbacks(request: $request) {
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
          location
          suggestion
          orderIndex
        }
      }
    }
  }
`

export enum QuerySubmissionFeedbacks {
    Query1 = "query1",
}

const queryMap: Record<QuerySubmissionFeedbacks, DocumentNode> = {
    [QuerySubmissionFeedbacks.Query1]: query1,
}

export type SubmissionFeedbacksListFilters = PaginationFilters<SubmissionFeedbacksSortBy>

export interface SubmissionFeedbacksListRequest {
    submissionAttemptId: string
    filters: SubmissionFeedbacksListFilters
}

export interface QuerySubmissionFeedbacksResponse {
    submissionFeedbacks: GraphQLResponse<QuerySubmissionFeedbacksPayload>
}

export const defaultSubmissionFeedbacksListSorts: Array<SortInput<SubmissionFeedbacksSortBy>> = [
    {
        by: SubmissionFeedbacksSortBy.CreatedAt,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated submission feedbacks (`ref/queries/submission-feedbacks/submission-feedbacks`).
 */
export const querySubmissionFeedbacks = async ({
    query = QuerySubmissionFeedbacks.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QuerySubmissionFeedbacks, SubmissionFeedbacksListRequest>) => {
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

    return apollo.query<QuerySubmissionFeedbacksResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
