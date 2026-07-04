import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMockInterviewPromptsResponse } from "./types"

const query1 = gql`
  query MockInterviewPrompts($courseId: ID!) {
    mockInterviewPrompts(courseId: $courseId) {
      success
      message
      error
      data {
        prompts {
          id
          title
          difficulty
          source
        }
      }
    }
  }
`

export enum QueryMockInterviewPrompts {
    Query1 = "query1",
}

const queryMap: Record<QueryMockInterviewPrompts, DocumentNode> = {
    [QueryMockInterviewPrompts.Query1]: query1,
}

/** Request body for the mock-interview-prompts query. */
export interface MockInterviewPromptsRequest {
    /** Course whose capstone systems seed the prompt bank. */
    courseId: string
}

/**
 * Fetches the mock-interview prompt bank for a course — the capstone systems
 * (plus later AI-generated classics) the learner can pick to design. Mirrors
 * backend `queries/flashcard-decks/mock-interview-prompts`.
 */
export const queryMockInterviewPrompts = async ({
    query = QueryMockInterviewPrompts.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMockInterviewPrompts, MockInterviewPromptsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMockInterviewPromptsResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}
