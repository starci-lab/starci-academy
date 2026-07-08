import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    StartMockInterviewSessionRequest,
    MutateStartMockInterviewSessionResponse,
} from "./types/start-mock-interview-session"

const mutation1 = gql`
  mutation StartMockInterviewSession($request: StartMockInterviewSessionRequest!) {
    startMockInterviewSession(request: $request) {
      success
      message
      error
      data {
        sessionId
        promptId
        promptTitle
        difficulty
        source
        level
        mode
        seedTopics {
          cardId
          kind
          title
          givenCodes {
            lang
            code
          }
        }
        deadlineAt
      }
    }
  }
`

export enum MutationStartMockInterviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationStartMockInterviewSession, DocumentNode> = {
    [MutationStartMockInterviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateStartMockInterviewSession}. */
export type MutateStartMockInterviewSessionParams = MutateParams<
    MutationStartMockInterviewSession,
    StartMockInterviewSessionRequest
>

/**
 * Asks the server to draw a mock-interview prompt for one course + level —
 * capstone-first (progress-aware: only capstone milestone tasks the learner
 * has reached), falls back to a classic prompt of the same difficulty pool,
 * then any classic prompt so the draw never dead-ends. Persists a session row
 * server-side; the returned `sessionId` is later passed to
 * `gradeMockInterviewSession` so grading trusts the server-stored prompt/level
 * instead of whatever the client echoes.
 *
 * Mirrors backend `mutations/interview/start-mock-interview-session`.
 */
export const mutateStartMockInterviewSession = async ({
    mutation = MutationStartMockInterviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateStartMockInterviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateStartMockInterviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
