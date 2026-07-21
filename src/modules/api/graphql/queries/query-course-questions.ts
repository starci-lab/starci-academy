import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CourseQuestionsRequest,
    QueryCourseQuestionsResponse,
} from "./types"

const query1 = gql`
  query CourseQuestions($request: CourseQuestionsRequest!) {
    courseQuestions(request: $request) {
      success
      message
      error
      data {
        total
        questions {
          id
          body
          createdAt
          editedAt
          contentId
          contentTitle
          moduleId
          replyCount
          answeredByFounder
          isFounderAuthor
          isPinned
          reactions {
            total
            myReaction
            counts {
              type
              count
            }
          }
          author {
            id
            username
            displayName
            avatar
            isFollowedByMe
          }
        }
      }
    }
  }
`

/** Variant selector for {@link queryCourseQuestions}. */
export enum QueryCourseQuestions {
    Query1 = "query1",
}

const queryMap: Record<QueryCourseQuestions, DocumentNode> = {
    [QueryCourseQuestions.Query1]: query1,
}

/** Apollo params for {@link queryCourseQuestions}. */
export type QueryCourseQuestionsParams = QueryParams<QueryCourseQuestions, CourseQuestionsRequest>

/**
 * Course-wide Q&A roll-up: every top-level question (content-comment) across all
 * lessons of the course, filtered by status/scope + optional search, paginated.
 * Mirrors backend `courseQuestions`.
 */
export const queryCourseQuestions = async ({
    query = QueryCourseQuestions.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryCourseQuestionsParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryCourseQuestionsResponse>({
        query: queryMap[query],
        variables: { request },
    })
}
