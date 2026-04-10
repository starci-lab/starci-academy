import type { ChallengeSubmissionEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `challengeSubmissions` (`ChallengeSubmissionsSortBy`). */
export enum ChallengeSubmissionsSortBy {
    Name = "name",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

/** Inner payload: list of submission rows for one challenge. */
export interface ChallengeSubmissionsPayload {
    data: Array<ChallengeSubmissionEntity>
}

const query1 = gql`
  query ChallengeSubmissions($request: ChallengeSubmissionsRequest!) {
    challengeSubmissions(request: $request) {
      success
      message
      error
      data {
        data {
          id
          type
          title
          score
          orderIndex
          description
          userSubmission {
            submissionUrl
          }
        }
      }
    }
  }
`

export enum QueryChallengeSubmissions {
    Query1 = "query1",
}

const queryMap: Record<QueryChallengeSubmissions, DocumentNode> = {
    [QueryChallengeSubmissions.Query1]: query1,
}

export interface ChallengeSubmissionsListRequest {
    challengeId: string
    filters: {
        sorts: Array<SortInput<ChallengeSubmissionsSortBy>>
    }
}

export interface QueryChallengeSubmissionsResponse {
    challengeSubmissions: GraphQLResponse<ChallengeSubmissionsPayload>
}

export const defaultChallengeSubmissionsSorts: Array<
    SortInput<ChallengeSubmissionsSortBy>
> = [
    {
        by: ChallengeSubmissionsSortBy.CreatedAt,
        order: SortOrder.Asc,
    },
]

/**
 * All submission requirements for one challenge (`ref/challenge-submissions`).
 */
export const queryChallengeSubmissions = async ({
    query = QueryChallengeSubmissions.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryChallengeSubmissions, ChallengeSubmissionsListRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryChallengeSubmissionsResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
