import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    GradeMockInterviewSessionRequest,
    MutateGradeMockInterviewSessionResponse,
} from "./types/grade-mock-interview-session"

const mutation1 = gql`
  mutation GradeMockInterviewSession($request: GradeMockInterviewSessionRequest!) {
    gradeMockInterviewSession(request: $request) {
      success
      message
      error
      data {
        overallScore
        verdict
        phaseScores {
          phase
          score
          max
        }
        attributeScores {
          key
          score
        }
        strengths
        gaps
        followUpQuestion
      }
    }
  }
`

export enum MutationGradeMockInterviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationGradeMockInterviewSession, DocumentNode> = {
    [MutationGradeMockInterviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateGradeMockInterviewSession}. */
export type MutateGradeMockInterviewSessionParams = MutateParams<
    MutationGradeMockInterviewSession,
    GradeMockInterviewSessionRequest
>

/**
 * Grades a WHOLE completed mock-interview session (all recorded turns across
 * the 5 canonical phases) against the rubric, grounded in what the course
 * actually taught. Stateless on the client — nothing is persisted here.
 * Returns an overall 0–100 score, a pass/borderline/fail verdict, per-phase +
 * per-attribute score breakdowns, and concrete strengths/gaps feedback.
 *
 * Mirrors backend `mutations/interview/grade-mock-interview-session`.
 */
export const mutateGradeMockInterviewSession = async ({
    mutation = MutationGradeMockInterviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateGradeMockInterviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateGradeMockInterviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
