import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyInProgressFlashcardReviewSessionResponse } from "./types/my-in-progress-flashcard-review-session"

const query1 = gql`
  query MyInProgressFlashcardReviewSession($deckId: ID!) {
    myInProgressFlashcardReviewSession(deckId: $deckId) {
      success
      message
      error
      data {
        sessionId
        cardIds
        currentIndex
        reviewedCount
        gradedIndexes
        xpEarned
        updatedAt
      }
    }
  }
`

export enum QueryMyInProgressFlashcardReviewSession {
    Query1 = "query1",
}

const queryMap: Record<QueryMyInProgressFlashcardReviewSession, DocumentNode> = {
    [QueryMyInProgressFlashcardReviewSession.Query1]: query1,
}

/** Request body for the my-in-progress-flashcard-review-session query. */
export interface MyInProgressFlashcardReviewSessionRequest {
    /** Deck to check for a resumable in-progress "Học thẻ" run. */
    deckId: string
}

/**
 * Fetches the viewer's resumable in-progress "Học thẻ" review session for a
 * deck, if any (24h TTL, `status="in_progress"` only) — `null` when there is
 * none. Mirrors backend `queries/flashcard/my-in-progress-flashcard-review-session`.
 */
export const queryMyInProgressFlashcardReviewSession = async ({
    query = QueryMyInProgressFlashcardReviewSession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyInProgressFlashcardReviewSession, MyInProgressFlashcardReviewSessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyInProgressFlashcardReviewSessionResponse>({
        query: queryMap[query],
        variables: {
            deckId: request?.deckId,
        },
    })
}
