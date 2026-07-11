import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyMockInterviewAttemptBySessionResponse } from "./types/my-mock-interview-attempt-by-session"

const query1 = gql`
  query MyMockInterviewAttemptBySessionId($courseId: ID!, $sessionId: ID!) {
    myMockInterviewAttemptBySessionId(courseId: $courseId, sessionId: $sessionId) {
      success
      message
      error
      data {
        id
        sessionId
        promptId
        promptTitle
        level
        mode
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
        matchedContentIds
        questionReviews {
          questionIndex
          kind
          question
          candidateAnswer
          modelAnswer
          feedback
          score
          max
          matchedContentId
        }
        createdAt
      }
    }
  }
`

export enum QueryMyMockInterviewAttemptBySession {
    Query1 = "query1",
}

const queryMap: Record<QueryMyMockInterviewAttemptBySession, DocumentNode> = {
    [QueryMyMockInterviewAttemptBySession.Query1]: query1,
}

/** Request body for the my-mock-interview-attempt-by-session query. */
export interface MyMockInterviewAttemptBySessionRequest {
    /** Course the session belongs to. */
    courseId: string
    /** The session id to look up. */
    sessionId: string
}

/**
 * Fetches the viewer's graded mock-interview attempt for ONE session, or
 * `null` when no graded attempt exists yet for that session (still in
 * progress, or the id doesn't belong to the viewer/course). Mirrors backend
 * `queries/flashcard-decks/my-mock-interview-attempt-by-session` — the
 * fallback read for a resume attempt whose session is no longer
 * `in_progress`, so a session that finished (or auto-graded on timeout) can
 * still show its result instead of a plain "session expired" error.
 */
export const queryMyMockInterviewAttemptBySession = async ({
    query = QueryMyMockInterviewAttemptBySession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyMockInterviewAttemptBySession, MyMockInterviewAttemptBySessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyMockInterviewAttemptBySessionResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            sessionId: request?.sessionId,
        },
    })
}
