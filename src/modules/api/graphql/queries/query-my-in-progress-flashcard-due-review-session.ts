import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyInProgressFlashcardDueReviewSessionResponse } from "./types/my-in-progress-flashcard-due-review-session"

const query1 = gql`
  query MyInProgressFlashcardDueReviewSession($courseId: ID!) {
    myInProgressFlashcardDueReviewSession(courseId: $courseId) {
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

export enum QueryMyInProgressFlashcardDueReviewSession {
    Query1 = "query1",
}

const queryMap: Record<QueryMyInProgressFlashcardDueReviewSession, DocumentNode> = {
    [QueryMyInProgressFlashcardDueReviewSession.Query1]: query1,
}

/** Request body for the my-in-progress-flashcard-due-review-session query. */
export interface MyInProgressFlashcardDueReviewSessionRequest {
    /** Course to check for a resumable in-progress cross-deck due-review batch. */
    courseId: string
}

/**
 * Fetches the viewer's resumable in-progress cross-deck DueReview batch
 * session for a course, if any (24h TTL, `status="in_progress"` only) —
 * `null` when there is none. Mirrors backend
 * `queries/flashcard/my-in-progress-flashcard-due-review-session`.
 */
export const queryMyInProgressFlashcardDueReviewSession = async ({
    query = QueryMyInProgressFlashcardDueReviewSession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyInProgressFlashcardDueReviewSession, MyInProgressFlashcardDueReviewSessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyInProgressFlashcardDueReviewSessionResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
