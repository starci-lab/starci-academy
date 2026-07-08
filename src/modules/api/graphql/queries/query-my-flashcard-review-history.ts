import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardReviewHistoryResponse } from "./types/my-flashcard-review-history"

const query1 = gql`
  query MyFlashcardReviewHistory($courseId: ID!, $limit: Int, $offset: Int) {
    myFlashcardReviewHistory(courseId: $courseId, limit: $limit, offset: $offset) {
      success
      message
      error
      data {
        totalCount
        items {
          id
          updatedAt
          deckId
          deckTitle
          cardCount
          reviewedCount
          xpEarned
        }
      }
    }
  }
`

export enum QueryMyFlashcardReviewHistory {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardReviewHistory, DocumentNode> = {
    [QueryMyFlashcardReviewHistory.Query1]: query1,
}

/** Variables for {@link queryMyFlashcardReviewHistory}. */
export interface QueryMyFlashcardReviewHistoryRequest {
    /** Course to fetch completed review session history for. */
    courseId: string
    /** Maximum number of history items to fetch (page size). */
    limit?: number
    /** Number of history items to skip (page offset). */
    offset?: number
}

/**
 * Fetches the learner's completed flashcard review ("Học thẻ") session
 * history for one course (paginated). Mirrors `myFlashcardReviewHistory`
 * (queries/flashcard/my-flashcard-review-history).
 */
export const queryMyFlashcardReviewHistory = async ({
    query = QueryMyFlashcardReviewHistory.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardReviewHistory, QueryMyFlashcardReviewHistoryRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyFlashcardReviewHistoryResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            limit: request?.limit,
            offset: request?.offset,
        },
    })
}
