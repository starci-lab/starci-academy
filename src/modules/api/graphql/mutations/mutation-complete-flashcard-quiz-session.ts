import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CompleteFlashcardQuizSessionRequest,
    MutateCompleteFlashcardQuizSessionResponse,
} from "./types/complete-flashcard-quiz-session"

const mutation1 = gql`
  mutation CompleteFlashcardQuizSession($request: CompleteFlashcardQuizSessionRequest!) {
    completeFlashcardQuizSession(request: $request) {
      success
      message
      error
      data {
        xpEarned
        dailyCapReached
        weakTags {
          tag
          coverage
          moduleId
          contentId
        }
        readiness {
          currentAvg
          threshold
          unlocked
        }
      }
    }
  }
`

export enum MutationCompleteFlashcardQuizSession {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCompleteFlashcardQuizSession, DocumentNode> = {
    [MutationCompleteFlashcardQuizSession.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateCompleteFlashcardQuizSession}. */
export type MutateCompleteFlashcardQuizSessionParams = MutateParams<
    MutationCompleteFlashcardQuizSession,
    CompleteFlashcardQuizSessionRequest
>

/**
 * Finalizes a non-AI flashcard quick-quiz session and awards XP (idempotent per
 * `sessionId`). The quiz is enrolled-only, so the caller passes the course via
 * the `X-Course-Id` header for the backend enrollment guard. Mirrors
 * `completeFlashcardQuizSession` (mutations/flashcards/complete-flashcard-quiz-session).
 */
export const mutateCompleteFlashcardQuizSession = async ({
    mutation = MutationCompleteFlashcardQuizSession.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateCompleteFlashcardQuizSessionParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateCompleteFlashcardQuizSessionResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
