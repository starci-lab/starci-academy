import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CompleteFlashcardReviewSessionRequest,
    MutateCompleteFlashcardReviewSessionResponse,
} from "./types/complete-flashcard-review-session"

const mutation1 = gql`
  mutation CompleteFlashcardReviewSession($request: CompleteFlashcardReviewSessionRequest!) {
    completeFlashcardReviewSession(request: $request) {
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

export enum MutationCompleteFlashcardReviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCompleteFlashcardReviewSession, DocumentNode> = {
    [MutationCompleteFlashcardReviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCompleteFlashcardReviewSession}. */
export type MutateCompleteFlashcardReviewSessionParams = MutateParams<
    MutationCompleteFlashcardReviewSession,
    CompleteFlashcardReviewSessionRequest
>

/**
 * Records a finished "Học thẻ" review run — flips the persisted session to
 * "completed" and snapshots the final reviewed-count/xpEarned bookkeeping
 * values (no server-side XP grant; `reviewFlashcard` itself grants none).
 * Mirrors backend `mutations/flashcard/complete-flashcard-review-session`.
 */
export const mutateCompleteFlashcardReviewSession = async ({
    mutation = MutationCompleteFlashcardReviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateCompleteFlashcardReviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateCompleteFlashcardReviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
