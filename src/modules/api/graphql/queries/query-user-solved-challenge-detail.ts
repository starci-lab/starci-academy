import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryUserSolvedChallengeDetailRequest, QueryUserSolvedChallengeDetailResponse } from "./types"

const query1 = gql`
  query UserSolvedChallengeDetail($request: UserSolvedChallengeDetailRequest!) {
    userSolvedChallengeDetail(request: $request) {
      success
      message
      error
      data {
        id
        title
        submissionUrl
        submissionType
        selectedLang
        difficulty
        score
        courseTitle
        passedAt
        feedbacks {
          message
          detail
          severity
          location
          suggestion
        }
      }
    }
  }
`

export enum QueryUserSolvedChallengeDetail {
    Query1 = "query1",
}

const queryMap: Record<QueryUserSolvedChallengeDetail, DocumentNode> = {
    [QueryUserSolvedChallengeDetail.Query1]: query1,
}

/**
 * Fetches the detail of one of a target user's passed challenge submissions,
 * including the structured AI feedback from the passing attempt. Mirrors
 * `userSolvedChallengeDetail` (queries/users/user-solved-challenge-detail);
 * result at `data.userSolvedChallengeDetail.data`.
 */
export const queryUserSolvedChallengeDetail = async ({
    query = QueryUserSolvedChallengeDetail.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryUserSolvedChallengeDetail, QueryUserSolvedChallengeDetailRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryUserSolvedChallengeDetailResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
