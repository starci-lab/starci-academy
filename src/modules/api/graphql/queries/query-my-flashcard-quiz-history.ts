import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardQuizHistoryResponse } from "./types/my-flashcard-quiz-history"

const query1 = gql`
  query MyFlashcardQuizHistory($courseId: ID!, $limit: Int, $offset: Int) {
    myFlashcardQuizHistory(courseId: $courseId, limit: $limit, offset: $offset) {
      success
      message
      error
      data {
        totalCount
        items {
          id
          updatedAt
          mode
          level
          cardCount
          coverage
          xpEarned
          weakTags {
            tag
            coverage
            moduleId
            contentId
          }
        }
      }
    }
  }
`

export enum QueryMyFlashcardQuizHistory {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardQuizHistory, DocumentNode> = {
    [QueryMyFlashcardQuizHistory.Query1]: query1,
}

/** Variables for {@link queryMyFlashcardQuizHistory}. */
export interface QueryMyFlashcardQuizHistoryRequest {
    /** Course to fetch completed quick-quiz session history for. */
    courseId: string
    /** Maximum number of history items to fetch (page size). */
    limit?: number
    /** Number of history items to skip (page offset). */
    offset?: number
}

/**
 * Fetches the learner's completed flashcard quick-quiz session history for one
 * course (paginated). Mirrors `myFlashcardQuizHistory`
 * (queries/flashcards/my-flashcard-quiz-history).
 */
export const queryMyFlashcardQuizHistory = async ({
    query = QueryMyFlashcardQuizHistory.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardQuizHistory, QueryMyFlashcardQuizHistoryRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyFlashcardQuizHistoryResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            limit: request?.limit,
            offset: request?.offset,
        },
    })
}
