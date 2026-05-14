import { createAuthApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `userCvSubmissionAttempts`. */
export enum UserCvSubmissionAttemptsSortBy {
    CreatedAt = "createdAt",
}

const query1 = gql`
  query UserCvSubmissionAttempts($request: UserCvSubmissionAttemptsRequest) {
    userCvSubmissionAttempts(request: $request) {
      success
      message
      error
      data {
        cvSubmissionId
        totalCount
        data {
          attemptId
          attemptNumber
          fileKey
          fileUrl
          submittedAt
          status
          detailFeedback
          score
        }
      }
    }
  }
`

export enum QueryUserCvSubmissionAttempts {
    Query1 = "query1",
}

const queryMap: Record<QueryUserCvSubmissionAttempts, DocumentNode> = {
    [QueryUserCvSubmissionAttempts.Query1]: query1,
}

export interface UserCvSubmissionAttemptItemPayload {
    attemptId: string
    attemptNumber: number
    fileKey: string
    fileUrl: string
    submittedAt: string
    status: string
    detailFeedback: string | null
    score?: number | null
}

export interface UserCvSubmissionAttemptsDataPayload {
    cvSubmissionId: string
    totalCount: number
    data: Array<UserCvSubmissionAttemptItemPayload>
}

export interface QueryUserCvSubmissionAttemptsResponse {
    userCvSubmissionAttempts: GraphQLResponse<UserCvSubmissionAttemptsDataPayload>
}

export interface UserCvSubmissionAttemptsListFilters {
    /** 0-based page index (matches API). */
    pageNumber?: number
    limit?: number
    sorts?: Array<SortInput<UserCvSubmissionAttemptsSortBy>>
}

export interface UserCvSubmissionAttemptsListRequest {
    filters?: UserCvSubmissionAttemptsListFilters
}

export const defaultUserCvSubmissionAttemptsSorts: Array<SortInput<UserCvSubmissionAttemptsSortBy>> = [
    {
        by: UserCvSubmissionAttemptsSortBy.CreatedAt,
        order: SortOrder.Desc,
    },
]

/**
 * Paginated CV submission attempts for the signed-in user.
 */
export const queryUserCvSubmissionAttempts = async ({
    query = QueryUserCvSubmissionAttempts.Query1,
    request,
    debug,
    signal,
    headers,
}: QueryParams<QueryUserCvSubmissionAttempts, UserCvSubmissionAttemptsListRequest | undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryUserCvSubmissionAttemptsResponse>({
        query: queryMap[query],
        variables: {
            request: request ?? {},
        },
        fetchPolicy: "no-cache",
    })
}
