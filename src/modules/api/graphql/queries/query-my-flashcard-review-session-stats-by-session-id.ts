import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardReviewSessionStatsBySessionIdResponse } from "./types/my-flashcard-review-session-stats-by-session-id"

const query1 = gql`
  query MyFlashcardReviewSessionStatsBySessionId($sessionId: ID!) {
    myFlashcardReviewSessionStatsBySessionId(sessionId: $sessionId) {
      success
      message
      error
      data {
        sessionId
        status
        reviewedCount
        gradeCounts {
          again
          hard
          good
          easy
        }
        durationSeconds
        xpEarned
        nextDueAt
        weakTags {
          tag
          forgotCount
        }
      }
    }
  }
`

export enum QueryMyFlashcardReviewSessionStatsBySessionId {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardReviewSessionStatsBySessionId, DocumentNode> = {
    [QueryMyFlashcardReviewSessionStatsBySessionId.Query1]: query1,
}

/** Request body for the my-flashcard-review-session-stats-by-session-id query. */
export interface MyFlashcardReviewSessionStatsBySessionIdRequest {
    /** Id of the session to resolve + aggregate. */
    sessionId: string
}

/**
 * Fetches the recap STATS of one flashcard review session by its id alone —
 * per-grade distribution, duration, next-due, XP, and weak tags — resolving the
 * session across both the deck-review and cross-deck due-review tables,
 * owner-scoped. `null` when not found/not owned. Mirrors backend
 * `queries/flashcard/my-flashcard-review-session-stats-by-session-id`; drives the
 * end-of-session stats surface AND the revisit-a-completed-session-by-URL path.
 */
export const queryMyFlashcardReviewSessionStatsBySessionId = async ({
    query = QueryMyFlashcardReviewSessionStatsBySessionId.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardReviewSessionStatsBySessionId, MyFlashcardReviewSessionStatsBySessionIdRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyFlashcardReviewSessionStatsBySessionIdResponse>({
        query: queryMap[query],
        variables: {
            sessionId: request?.sessionId,
        },
    })
}
