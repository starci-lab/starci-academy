import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyMockInterviewAttemptsResponse } from "./types/my-mock-interview-attempts"

const query1 = gql`
  query MyMockInterviewAttempts($courseId: ID!, $limit: Int, $offset: Int) {
    myMockInterviewAttempts(courseId: $courseId, limit: $limit, offset: $offset) {
      success
      message
      error
      data {
        totalCount
        items {
          id
          sessionId
          promptId
          promptTitle
          level
          overallScore
          verdict
          phaseScores {
            phase
            score
            max
          }
          attributeScores {
            key
            score
          }
          strengths
          gaps
          followUpQuestion
          createdAt
        }
      }
    }
  }
`

export enum QueryMyMockInterviewAttempts {
    Query1 = "query1",
}

const queryMap: Record<QueryMyMockInterviewAttempts, DocumentNode> = {
    [QueryMyMockInterviewAttempts.Query1]: query1,
}

/** Request body for the my-mock-interview-attempts query. */
export interface MyMockInterviewAttemptsRequest {
    /** Course whose mock-interview history to fetch. */
    courseId: string
    /** Page size (attempts per page); server defaults to 10, caps at 50. */
    limit?: number
    /** Page offset (attempts to skip); server defaults to 0. */
    offset?: number
}

/**
 * Fetches a page of the viewer's mock-interview history for a course — every
 * past graded session, newest first. Mirrors backend
 * `queries/flashcard-decks/my-mock-interview-attempts`.
 */
export const queryMyMockInterviewAttempts = async ({
    query = QueryMyMockInterviewAttempts.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyMockInterviewAttempts, MyMockInterviewAttemptsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyMockInterviewAttemptsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            limit: request?.limit,
            offset: request?.offset,
        },
    })
}
