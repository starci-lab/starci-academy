import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    QueryUserCodingProblemDetailRequest,
    QueryUserCodingProblemDetailResponse,
} from "./types"

const query1 = gql`
  query UserCodingProblemDetail($request: UserCodingProblemDetailRequest!) {
    userCodingProblemDetail(request: $request) {
      success
      message
      error
      data {
        problem {
          id
          slug
          title
          statement
          difficulty
          points
          domain
          tags
          testcases {
            id
            input
            expectedOutput
            isSample
            sortIndex
          }
          starterCodes {
            id
            language
            code
          }
        }
        submission {
          languages
          verdict
          passedCount
          totalCount
          firstSolvedAt
        }
      }
    }
  }
`

export enum QueryUserCodingProblemDetail {
    Query1 = "query1",
}

const queryMap: Record<QueryUserCodingProblemDetail, DocumentNode> = {
    [QueryUserCodingProblemDetail.Query1]: query1,
}

/**
 * Fetches one coding problem's detail (statement, tags, sample testcases, starter
 * code) plus a target user's accepted-submission summary for it, for the public
 * profile's `/profile/<username>/skills/<slug>` surface. Mirrors
 * `userCodingProblemDetail` (queries/users/user-coding-problem-detail); result at
 * `data.userCodingProblemDetail.data`.
 */
export const queryUserCodingProblemDetail = async ({
    query = QueryUserCodingProblemDetail.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryUserCodingProblemDetail, QueryUserCodingProblemDetailRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryUserCodingProblemDetailResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
