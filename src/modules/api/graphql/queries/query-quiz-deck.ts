import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryQuizDeckResponse } from "./types"

const query1 = gql`
  query QuizDeck($quizDeckId: ID!) {
    quizDeck(quizDeckId: $quizDeckId) {
      success
      message
      error
      data {
        id
        displayId
        title
        description
        difficulty
        orderIndex
        defaultLocale
        cards {
          id
          question
          explanation
          orderIndex
          defaultLocale
          options {
            id
            text
            isCorrect
            orderIndex
          }
        }
      }
    }
  }
`

export enum QueryQuizDeck {
    Query1 = "query1",
}

const queryMap: Record<QueryQuizDeck, DocumentNode> = {
    [QueryQuizDeck.Query1]: query1,
}

/** Request body for the `quizDeck` query. */
export interface QuizDeckRequest {
    /** The deck id to fetch. */
    quizDeckId: string
}

/**
 * One quiz deck by id, with cards + options.
 */
export const queryQuizDeck = async ({
    query = QueryQuizDeck.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryQuizDeck, QuizDeckRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryQuizDeckResponse>({
        query: queryMap[query],
        variables: {
            quizDeckId: request?.quizDeckId,
        },
    })
}
