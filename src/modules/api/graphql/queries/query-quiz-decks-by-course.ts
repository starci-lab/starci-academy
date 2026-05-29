import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryQuizDecksByCourseResponse } from "./types"

const query1 = gql`
  query QuizDecksByCourse($courseId: ID!, $contentId: ID) {
    quizDecksByCourse(courseId: $courseId, contentId: $contentId) {
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
          orderIndex
        }
      }
    }
  }
`

export enum QueryQuizDecksByCourse {
    Query1 = "query1",
}

const queryMap: Record<QueryQuizDecksByCourse, DocumentNode> = {
    [QueryQuizDecksByCourse.Query1]: query1,
}

/** Request body for the `quizDecksByCourse` query. */
export interface QuizDecksByCourseRequest {
    /** Owning course id. */
    courseId: string
    /** Optional content id to filter the course's decks. */
    contentId?: string
}

/**
 * Lists the interview-prep quiz decks owned by a course (optionally filtered by content).
 */
export const queryQuizDecksByCourse = async ({
    query = QueryQuizDecksByCourse.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryQuizDecksByCourse, QuizDecksByCourseRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryQuizDecksByCourseResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            contentId: request?.contentId,
        },
    })
}
