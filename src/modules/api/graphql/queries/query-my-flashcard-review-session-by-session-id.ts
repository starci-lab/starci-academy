import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardReviewSessionBySessionIdResponse } from "./types/my-flashcard-review-session-by-session-id"

const query1 = gql`
  query MyFlashcardReviewSessionBySessionId($sessionId: ID!) {
    myFlashcardReviewSessionBySessionId(sessionId: $sessionId) {
      success
      message
      error
      data {
        sessionId
        kind
        deckId
        deckTitle
        cardIds
        currentIndex
        reviewedCount
        xpEarned
        updatedAt
      }
    }
  }
`

export enum QueryMyFlashcardReviewSessionBySessionId {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardReviewSessionBySessionId, DocumentNode> = {
    [QueryMyFlashcardReviewSessionBySessionId.Query1]: query1,
}

/** Request body for the my-flashcard-review-session-by-session-id query. */
export interface MyFlashcardReviewSessionBySessionIdRequest {
    /** Id of the session to resolve. */
    sessionId: string
}

/**
 * Fetches a flashcard "Học thẻ" session by its id alone (whichever kind it
 * is) — `null` when not found/not owned by the caller. Mirrors backend
 * `queries/flashcard/my-flashcard-review-session-by-session-id`; this is the
 * unified live route's resolve step (thầy 2026-07-11: "bỏ deck đi, only
 * session thôi" — no `deckId` query hint needed, the session already
 * persists that context).
 */
export const queryMyFlashcardReviewSessionBySessionId = async ({
    query = QueryMyFlashcardReviewSessionBySessionId.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardReviewSessionBySessionId, MyFlashcardReviewSessionBySessionIdRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyFlashcardReviewSessionBySessionIdResponse>({
        query: queryMap[query],
        variables: {
            sessionId: request?.sessionId,
        },
    })
}
