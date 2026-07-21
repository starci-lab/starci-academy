import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { QuerySearchCourseContentResponse } from "./types/search-course-content"

const query1 = gql`
  query SearchCourseContent($courseId: ID!, $query: String!, $kinds: [String!]) {
    searchCourseContent(courseId: $courseId, query: $query, kinds: $kinds) {
      success
      message
      error
      data {
        results {
          kind
          title
          breadcrumb
          snippet
          isLocked
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
    /**
     * Corpus kinds to search (`["challenge"]`, `["flashcard"]`, `["content","code"]`).
     * PASS THIS whenever the caller wants one kind: the backend takes a single
     * top-k across every kind, so an unscoped topical query comes back
     * content-dominated and a client-side kind filter then empties it. Omit only
     * to genuinely search everything.
     */
    kinds?: Array<string>
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
    kinds,
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
            kinds,
        },
    })
}
