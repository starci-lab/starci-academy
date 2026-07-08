import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    StartFlashcardReviewSessionRequest,
    MutateStartFlashcardReviewSessionResponse,
} from "./types/start-flashcard-review-session"

const mutation1 = gql`
  mutation StartFlashcardReviewSession($request: StartFlashcardReviewSessionRequest!) {
    startFlashcardReviewSession(request: $request) {
      success
      message
      error
      data {
        sessionId
      }
    }
  }
`

export enum MutationStartFlashcardReviewSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationStartFlashcardReviewSession, DocumentNode> = {
    [MutationStartFlashcardReviewSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateStartFlashcardReviewSession}. */
export type MutateStartFlashcardReviewSessionParams = MutateParams<
    MutationStartFlashcardReviewSession,
    StartFlashcardReviewSessionRequest
>

/**
 * Draws a "Học thẻ" review session server-side and returns its id — called
 * right after the deck's cards are fetched/sorted, before the reviewer opens
 * its first card, so every subsequent call
 * (`syncFlashcardReviewSessionProgress`, `completeFlashcardReviewSession`)
 * shares one server-issued id. Mirrors backend
 * `mutations/flashcard/start-flashcard-review-session`.
 */
export const mutateStartFlashcardReviewSession = async ({
    mutation = MutationStartFlashcardReviewSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateStartFlashcardReviewSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateStartFlashcardReviewSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
