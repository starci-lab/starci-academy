import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardQuizSessionBySessionIdResponse } from "./types/my-flashcard-quiz-session-by-session-id"

const query1 = gql`
  query MyFlashcardQuizSessionBySessionId($sessionId: ID!) {
    myFlashcardQuizSessionBySessionId(sessionId: $sessionId) {
      success
      message
      error
      data {
        sessionId
        status
        mode
        level
        coverage
        xpEarned
        cardCount
        answeredCount
        fullyCorrectCount
        durationSeconds
        weakTags {
          tag
          coverage
          moduleId
          contentId
        }
        results {
          cardId
          correctBlanks
          totalBlanks
        }
      }
    }
  }
`

export enum QueryMyFlashcardQuizSessionBySessionId {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardQuizSessionBySessionId, DocumentNode> = {
    [QueryMyFlashcardQuizSessionBySessionId.Query1]: query1,
}

/** Request body for the my-flashcard-quiz-session-by-session-id query. */
export interface MyFlashcardQuizSessionBySessionIdRequest {
    /** Id of the "Hỏi nhanh" session to resolve. */
    sessionId: string
}

/**
 * Fetches the persisted snapshot of one "Hỏi nhanh" quiz session by its id alone —
 * mode, level, coverage, XP, per-card blank breakdown, and weak tags — owner-scoped
 * and status-agnostic (resolves completed/abandoned/in-progress). `null` when not
 * found / not owned. Mirrors backend
 * `queries/flashcard/my-flashcard-quiz-session-by-session-id`; drives the
 * URL-addressable quiz RESULT surface AND the revisit-a-finished-session-by-URL path.
 */
export const queryMyFlashcardQuizSessionBySessionId = async ({
    query = QueryMyFlashcardQuizSessionBySessionId.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardQuizSessionBySessionId, MyFlashcardQuizSessionBySessionIdRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyFlashcardQuizSessionBySessionIdResponse>({
        query: queryMap[query],
        variables: {
            sessionId: request?.sessionId,
        },
    })
}
