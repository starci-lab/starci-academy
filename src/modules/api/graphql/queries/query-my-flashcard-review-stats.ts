import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyFlashcardReviewStatsResponse } from "./types/my-flashcard-review-stats"

const query1 = gql`
  query MyFlashcardReviewStats($courseId: ID!) {
    myFlashcardReviewStats(courseId: $courseId) {
      success
      message
      error
      data {
        dailyActivity {
          date
          cardsReviewed
        }
        byDeck {
          deckId
          deckTitle
          sessionCount
          cardsReviewed
          totalCards
        }
        dueToday
        dueForecast {
          date
          count
        }
        masteryBreakdown {
          mastered
          learning
          new
        }
      }
    }
  }
`

export enum QueryMyFlashcardReviewStats {
    Query1 = "query1",
}

const queryMap: Record<QueryMyFlashcardReviewStats, DocumentNode> = {
    [QueryMyFlashcardReviewStats.Query1]: query1,
}

/** Variables for {@link queryMyFlashcardReviewStats}. */
export interface QueryMyFlashcardReviewStatsRequest {
    /** Course to fetch aggregate review stats for. */
    courseId: string
}

/**
 * Fetches the learner's aggregate flashcard review ("Học thẻ") stats for one
 * course (reviewed-count/XP trend, per-deck progress — no per-tag breakdown,
 * review sessions carry no per-card correctness data to derive one from).
 * Mirrors `myFlashcardReviewStats` (queries/flashcard/my-flashcard-review-stats).
 */
export const queryMyFlashcardReviewStats = async ({
    query = QueryMyFlashcardReviewStats.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyFlashcardReviewStats, QueryMyFlashcardReviewStatsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyFlashcardReviewStatsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
