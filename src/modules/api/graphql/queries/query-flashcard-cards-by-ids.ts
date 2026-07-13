import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryFlashcardCardsByIdsResponse } from "./types/flashcard-cards-by-ids"

const query1 = gql`
  query FlashcardCardsByIds($courseId: String, $cardIds: [String!]!) {
    flashcardCardsByIds(courseId: $courseId, cardIds: $cardIds) {
      success
      message
      error
      data {
        cards {
          cardId
          deckTitle
          front
          back
          level
          tags
        }
      }
    }
  }
`

export enum QueryFlashcardCardsByIds {
    Query1 = "query1",
}

const queryMap: Record<QueryFlashcardCardsByIds, DocumentNode> = {
    [QueryFlashcardCardsByIds.Query1]: query1,
}

/** Request body for the flashcard-cards-by-ids query. */
export interface FlashcardCardsByIdsRequest {
    /** Scope the review-row join to this course's enrollment; omit for the global join. */
    courseId?: string
    /** The exact card ids to fetch, in caller order (max 100 server-side). */
    cardIds: Array<string>
}

/**
 * Fetches flashcards by an EXACT set of ids (localized front/back + deck title),
 * regardless of due status, in input order — used to hydrate card TEXT for a
 * persisted quiz session's `results` breakdown (which carries only per-card blank
 * counts by id). Mirrors backend `queries/flashcard-decks/flashcard-cards-by-ids`.
 */
export const queryFlashcardCardsByIds = async ({
    query = QueryFlashcardCardsByIds.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryFlashcardCardsByIds, FlashcardCardsByIdsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryFlashcardCardsByIdsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            cardIds: request?.cardIds ?? [],
        },
    })
}
