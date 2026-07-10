import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { QuerySearchCourseContentResponse } from "./types/search-course-content"

const query1 = gql`
  query SearchCourseContent($courseId: ID!, $query: String!) {
    searchCourseContent(courseId: $courseId, query: $query) {
      success
      message
      error
      data {
        results {
          kind
          title
          breadcrumb
          snippet
          score
          moduleId
          contentId
          deckId
          taskId
        }
      }
    }
  }
`

export enum QuerySearchCourseContent {
    Query1 = "query1",
}

const queryMap: Record<QuerySearchCourseContent, DocumentNode> = {
    [QuerySearchCourseContent.Query1]: query1,
}

/** Params for {@link querySearchCourseContent}. */
export interface QuerySearchCourseContentParams {
    /** Which document variant to run. */
    query?: QuerySearchCourseContent
    /** Course id to search within. */
    courseId: string
    /** The search query — keyword or natural-language question alike. */
    searchQuery: string
    /** Apollo debug flag. */
    debug?: boolean
    /** Abort signal. */
    signal?: AbortSignal
}

/**
 * RAG search over a course's lessons/challenges/flashcard decks/milestone
 * tasks — understands the MEANING of the query, not just literal keywords.
 * Mirrors backend `searchCourseContent`.
 */
export const querySearchCourseContent = async ({
    query = QuerySearchCourseContent.Query1,
    courseId,
    searchQuery,
    debug,
    signal,
}: QuerySearchCourseContentParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QuerySearchCourseContentResponse>({
        query: queryMap[query],
        variables: {
            courseId,
            query: searchQuery,
        },
    })
}
