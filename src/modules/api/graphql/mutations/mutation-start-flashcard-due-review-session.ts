import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    StartFlashcardDueReviewSessionRequest,
    MutateStartFlashcardDueReviewSessionResponse,
} from "./types/start-flashcard-due-review-session"

const mutation1 = gql`
  mutation StartFlashcardDueReviewSession($request: StartFlashcardDueReviewSessionRequest!) {
    startFlashcardDueReviewSession(request: $request) {
      success
      message
      error
      data {
        sessionId
      }
    }
  }
`

export enum MutationStartFlashcardDueReviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationStartFlashcardDueReviewSession, DocumentNode> = {
    [MutationStartFlashcardDueReviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateStartFlashcardDueReviewSession}. */
export type MutateStartFlashcardDueReviewSessionParams = MutateParams<
    MutationStartFlashcardDueReviewSession,
    StartFlashcardDueReviewSessionRequest
>

/**
 * Draws a cross-deck DueReview batch session server-side and returns its id —
 * called right after the due batch is fetched, before the first card is
 * shown, so every subsequent call (`syncFlashcardDueReviewSessionProgress`,
 * `completeFlashcardDueReviewSession`) shares one server-issued id. Mirrors
 * backend `mutations/flashcard/start-flashcard-due-review-session`.
 */
export const mutateStartFlashcardDueReviewSession = async ({
    mutation = MutationStartFlashcardDueReviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateStartFlashcardDueReviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateStartFlashcardDueReviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
