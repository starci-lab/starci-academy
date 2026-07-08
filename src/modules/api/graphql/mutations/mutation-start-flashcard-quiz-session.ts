import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    StartFlashcardQuizSessionRequest,
    MutateStartFlashcardQuizSessionResponse,
} from "./types/start-flashcard-quiz-session"

const mutation1 = gql`
  mutation StartFlashcardQuizSession($request: StartFlashcardQuizSessionRequest!) {
    startFlashcardQuizSession(request: $request) {
      success
      message
      error
      data {
        sessionId
      }
    }
  }
`

export enum MutationStartFlashcardQuizSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationStartFlashcardQuizSession, DocumentNode> = {
    [MutationStartFlashcardQuizSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateStartFlashcardQuizSession}. */
export type MutateStartFlashcardQuizSessionParams = MutateParams<
    MutationStartFlashcardQuizSession,
    StartFlashcardQuizSessionRequest
>

/**
 * Draws a "Hỏi nhanh" quiz session server-side and returns its id — called right
 * after the client draws `sessionCards`, before showing question 1, so every
 * subsequent call (`syncFlashcardQuizSessionProgress`, `completeFlashcardQuizSession`,
 * the resumable `.../quiz/[sessionId]` route) shares one server-issued id instead
 * of a client-generated uuid. Mirrors backend
 * `mutations/flashcard/start-flashcard-quiz-session`.
 */
export const mutateStartFlashcardQuizSession = async ({
    mutation = MutationStartFlashcardQuizSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateStartFlashcardQuizSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateStartFlashcardQuizSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
