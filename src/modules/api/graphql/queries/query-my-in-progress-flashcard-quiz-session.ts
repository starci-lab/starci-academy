import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyInProgressFlashcardQuizSessionResponse } from "./types/my-in-progress-flashcard-quiz-session"

const query1 = gql`
  query MyInProgressFlashcardQuizSession($courseId: ID!) {
    myInProgressFlashcardQuizSession(courseId: $courseId) {
      success
      message
      error
      data {
        sessionId
        cardIds
        name
        currentIndex
        results {
          cardId
          correctBlanks
          totalBlanks
        }
        updatedAt
        deadlineAt
      }
    }
  }
`

export enum QueryMyInProgressFlashcardQuizSession {
    Query1 = "query1",
}

const queryMap: Record<QueryMyInProgressFlashcardQuizSession, DocumentNode> = {
    [QueryMyInProgressFlashcardQuizSession.Query1]: query1,
}

/** Request body for the my-in-progress-flashcard-quiz-session query. */
export interface MyInProgressFlashcardQuizSessionRequest {
    /** Course to check for a resumable in-progress "Hỏi nhanh" run. */
    courseId: string
}

/**
 * Fetches the viewer's resumable in-progress "Hỏi nhanh" quiz session for a
 * course, if any (24h TTL, `status="in_progress"` only) — `null` when there
 * is none. Mirrors backend `queries/flashcard/my-in-progress-flashcard-quiz-session`.
 */
export const queryMyInProgressFlashcardQuizSession = async ({
    query = QueryMyInProgressFlashcardQuizSession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyInProgressFlashcardQuizSession, MyInProgressFlashcardQuizSessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyInProgressFlashcardQuizSessionResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
