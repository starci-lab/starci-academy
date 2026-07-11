import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CompleteFlashcardDueReviewSessionRequest,
    MutateCompleteFlashcardDueReviewSessionResponse,
} from "./types/complete-flashcard-due-review-session"

const mutation1 = gql`
  mutation CompleteFlashcardDueReviewSession($request: CompleteFlashcardDueReviewSessionRequest!) {
    completeFlashcardDueReviewSession(request: $request) {
      success
      message
      error
      data {
        reviewedCount
        xpEarned
      }
    }
  }
`

export enum MutationCompleteFlashcardDueReviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCompleteFlashcardDueReviewSession, DocumentNode> = {
    [MutationCompleteFlashcardDueReviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCompleteFlashcardDueReviewSession}. */
export type MutateCompleteFlashcardDueReviewSessionParams = MutateParams<
    MutationCompleteFlashcardDueReviewSession,
    CompleteFlashcardDueReviewSessionRequest
>

/**
 * Records a finished cross-deck DueReview batch — flips the persisted
 * session to "completed" and snapshots the final reviewed-count/xpEarned
 * bookkeeping values (no server-side XP grant; `reviewFlashcard` itself
 * grants none). Mirrors backend
 * `mutations/flashcard/complete-flashcard-due-review-session`.
 */
export const mutateCompleteFlashcardDueReviewSession = async ({
    mutation = MutationCompleteFlashcardDueReviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateCompleteFlashcardDueReviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateCompleteFlashcardDueReviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
