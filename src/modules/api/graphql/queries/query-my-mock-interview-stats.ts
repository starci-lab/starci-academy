import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyMockInterviewStatsResponse } from "./types/my-mock-interview-stats"

const query1 = gql`
  query MyMockInterviewStats($courseId: ID!) {
    myMockInterviewStats(courseId: $courseId) {
      success
      message
      error
      data {
        insufficientData
        modeSplit {
          qnaCount
          designCount
        }
        trend {
          completedAt
          overallScore
          mode
          verdict
        }
        byPhase {
          key
          avgScore
          avgMax
          weakCount
          attemptCount
        }
        byKind {
          key
          avgScore
          avgMax
          weakCount
          attemptCount
        }
        byAttribute {
          key
          avgScore
          avgMax
          weakCount
          attemptCount
        }
        byLevel {
          key
          avgScore
          avgMax
          weakCount
          attemptCount
        }
        byLanguage {
          key
          avgScore
          avgMax
          weakCount
          attemptCount
        }
        recurringGaps {
          text
          count
        }
        weakest {
          key
          axis
          avgScore
          avgMax
          weakCount
          matchedContentId
        }
        verdictCounts {
          pass
          borderline
          fail
        }
      }
    }
  }
`

export enum QueryMyMockInterviewStats {
    Query1 = "query1",
}

const queryMap: Record<QueryMyMockInterviewStats, DocumentNode> = {
    [QueryMyMockInterviewStats.Query1]: query1,
}

/** Request body for the my-mock-interview-stats query. */
export interface MyMockInterviewStatsRequest {
    /** Course whose mock-interview stats to compute. */
    courseId: string
}

/**
 * Fetches the viewer's aggregated mock-interview stats for a course — an
 * overall-score trend, mode split, per-phase (design) / per-kind (qna)
 * breakdowns, and the single weakest entry. Mirrors backend
 * `queries/flashcard-decks/my-mock-interview-stats`.
 */
export const queryMyMockInterviewStats = async ({
    query = QueryMyMockInterviewStats.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyMockInterviewStats, MyMockInterviewStatsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyMockInterviewStatsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
