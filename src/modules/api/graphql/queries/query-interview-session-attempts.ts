import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryInterviewSessionAttemptsResponse } from "./types"

const query1 = gql`
  query InterviewSessionAttempts($sessionId: ID!, $courseId: ID, $flashcardDeckId: ID) {
    interviewSessionAttempts(sessionId: $sessionId, courseId: $courseId, flashcardDeckId: $flashcardDeckId) {
      success
      message
      error
      data {
        items {
          id
          score
          verdict
          level
          tags
          question
          strengths
          gaps
          modelAnswerHint
          createdAt
        }
      }
    }
  }
`

export enum QueryInterviewSessionAttempts {
    Query1 = "query1",
}

const queryMap: Record<QueryInterviewSessionAttempts, DocumentNode> = {
    [QueryInterviewSessionAttempts.Query1]: query1,
}

/** Request body for the interview-session-attempts query. */
export interface InterviewSessionAttemptsRequest {
    /** The run (session) whose answers to list. */
    sessionId: string
    /** Optional course scope. */
    courseId?: string | null
    /** Optional deck scope (takes precedence over courseId). */
    flashcardDeckId?: string | null
}

/**
 * Fetches the answered questions of one mock-interview RUN — each with grade
 * (score/verdict), the question prompt, and the persisted feedback
 * (strengths/gaps/hint). Mirrors backend `interviewSessionAttempts`. Fresh read.
 */
export const queryInterviewSessionAttempts = async ({
    query = QueryInterviewSessionAttempts.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryInterviewSessionAttempts, InterviewSessionAttemptsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryInterviewSessionAttemptsResponse>({
        query: queryMap[query],
        variables: {
            sessionId: request?.sessionId,
            courseId: request?.courseId ?? null,
            flashcardDeckId: request?.flashcardDeckId ?? null,
        },
    })
}
