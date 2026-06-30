import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryInterviewSessionsResponse } from "./types"

const query1 = gql`
  query InterviewSessions($courseId: ID, $flashcardDeckId: ID, $limit: Int, $offset: Int) {
    interviewSessions(courseId: $courseId, flashcardDeckId: $flashcardDeckId, limit: $limit, offset: $offset) {
      success
      message
      error
      data {
        totalCount
        items {
          sessionId
          startedAt
          questionCount
          averageScore
          bestScore
          passCount
          borderlineCount
          failCount
          level
        }
      }
    }
  }
`

export enum QueryInterviewSessions {
    Query1 = "query1",
}

const queryMap: Record<QueryInterviewSessions, DocumentNode> = {
    [QueryInterviewSessions.Query1]: query1,
}

/** Request body for the interview-sessions query. */
export interface InterviewSessionsRequest {
    /** Optional course to scope the runs to (random-interview mode = course-wide). */
    courseId?: string | null
    /** Optional deck to scope the runs to; omit for course-/account-wide. */
    flashcardDeckId?: string | null
    /** Page size (sessions per page). */
    limit?: number | null
    /** Page offset (sessions to skip). */
    offset?: number | null
}

/**
 * Fetches the viewer's paginated mock-interview RUNS (sessions) — each item
 * groups one run's 5/10 answers into a summary (average score, verdict
 * breakdown, dominant level). Mirrors backend `interviewSessions`
 * (queries/flashcard-decks/interview-sessions). Fresh read (no cache).
 */
export const queryInterviewSessions = async ({
    query = QueryInterviewSessions.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryInterviewSessions, InterviewSessionsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryInterviewSessionsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId ?? null,
            flashcardDeckId: request?.flashcardDeckId ?? null,
            limit: request?.limit ?? null,
            offset: request?.offset ?? null,
        },
    })
}
