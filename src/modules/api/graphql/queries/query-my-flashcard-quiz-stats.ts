import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardQuizStatsResponse } from "./types/my-flashcard-quiz-stats"

const query1 = gql`
  query MyFlashcardQuizStats($courseId: ID!) {
    myFlashcardQuizStats(courseId: $courseId) {
      success
      message
      error
      data {
        insufficientData
        trend {
          completedAt
          coverage
          xpEarned
        }
        byTag {
          tag
          coverage
        }
        byDeck {
          deckId
          deckTitle
          sessionCount
          cardsAnswered
          totalCards
        }
        weakTagLinks {
          tag
          coverage
          moduleId
          contentId
        }
        hardCards {
          cardId
          question
          attempts
          wrongCount
          coverage
          deckId
          deckTitle
        }
        completedSessionCount
      }
    }
  }
`

export enum QueryMyFlashcardQuizStats {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardQuizStats, DocumentNode> = {
    [QueryMyFlashcardQuizStats.Query1]: query1,
}

/** Variables for {@link queryMyFlashcardQuizStats}. */
export interface QueryMyFlashcardQuizStatsRequest {
    /** Course to fetch aggregate quick-quiz stats for. */
    courseId: string
}

/**
 * Fetches the learner's aggregate flashcard quick-quiz stats for one course
 * (coverage/XP trend, per-tag coverage, per-deck progress). Mirrors
 * `myFlashcardQuizStats` (queries/flashcards/my-flashcard-quiz-stats).
 */
export const queryMyFlashcardQuizStats = async ({
    query = QueryMyFlashcardQuizStats.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardQuizStats, QueryMyFlashcardQuizStatsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyFlashcardQuizStatsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
