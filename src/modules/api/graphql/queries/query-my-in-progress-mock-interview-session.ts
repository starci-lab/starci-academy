import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyInProgressMockInterviewSessionResponse } from "./types/my-in-progress-mock-interview-session"

const query1 = gql`
  query MyInProgressMockInterviewSession($courseId: ID!) {
    myInProgressMockInterviewSession(courseId: $courseId) {
      success
      message
      error
      data {
        sessionId
        promptId
        promptTitle
        name
        level
        difficulty
        source
        mode
        seedQuestions {
          cardId
          kind
          title
          givenCodes {
            lang
            code
          }
        }
        turns {
          role
          phase
          content
          questionIndex
          artifactHint
        }
        questionIndex
        phaseIndex
        updatedAt
        deadlineAt
      }
    }
  }
`

export enum QueryMyInProgressMockInterviewSession {
    Query1 = "query1",
}

const queryMap: Record<QueryMyInProgressMockInterviewSession, DocumentNode> = {
    [QueryMyInProgressMockInterviewSession.Query1]: query1,
}

/** Request body for the my-in-progress-mock-interview-session query. */
export interface MyInProgressMockInterviewSessionRequest {
    /** Course to check for a resumable in-progress session. */
    courseId: string
}

/**
 * Fetches the viewer's resumable in-progress mock-interview session for a
 * course, if any (24h TTL, `status="in_progress"` only) — `null` when there
 * is none. Mirrors backend `queries/interview/my-in-progress-mock-interview-session`.
 */
export const queryMyInProgressMockInterviewSession = async ({
    query = QueryMyInProgressMockInterviewSession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyInProgressMockInterviewSession, MyInProgressMockInterviewSessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyInProgressMockInterviewSessionResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
