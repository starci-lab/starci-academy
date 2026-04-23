import type { ChallengeSubmissionEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query ChallengeSubmission($request: ChallengeSubmissionRequest!) {
    challengeSubmission(request: $request) {
      success
      message
      error
      data {
        id
        type
        title
        description
        userSubmission {
          submissionUrl
          score
        }
      }
    }
  }
`

export enum QueryChallengeSubmission {
    Query1 = "query1",
}

const queryMap: Record<QueryChallengeSubmission, DocumentNode> = {
    [QueryChallengeSubmission.Query1]: query1,
}

export interface QueryChallengeSubmissionResponse {
    challengeSubmission: GraphQLResponse<ChallengeSubmissionEntity>
}

/** Matches `ChallengeSubmissionRequest` (`ref/challenge-submissions`). */
export interface ChallengeSubmissionRequest {
    challengeSubmissionId: string
}

/**
 * One challenge submission by id, including optional `userSubmission` for the current user
 * (`ref/challenge-submissions/challenge-submission`).
 */
export const queryChallengeSubmission = async ({
    query = QueryChallengeSubmission.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: QueryParams<QueryChallengeSubmission, ChallengeSubmissionRequest>) => {
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

    return apollo.query<QueryChallengeSubmissionResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
