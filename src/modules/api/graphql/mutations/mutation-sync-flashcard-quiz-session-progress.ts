import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SyncFlashcardQuizSessionProgressRequest,
    MutateSyncFlashcardQuizSessionProgressResponse,
} from "./types/sync-flashcard-quiz-session-progress"

const mutation1 = gql`
  mutation SyncFlashcardQuizSessionProgress($request: SyncFlashcardQuizSessionProgressRequest!) {
    syncFlashcardQuizSessionProgress(request: $request) {
      success
      message
      error
      data {
        success
      }
    }
  }
`

export enum MutationSyncFlashcardQuizSessionProgress {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncFlashcardQuizSessionProgress, DocumentNode> = {
    [MutationSyncFlashcardQuizSessionProgress.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSyncFlashcardQuizSessionProgress}. */
export type MutateSyncFlashcardQuizSessionProgressParams = MutateParams<
    MutationSyncFlashcardQuizSessionProgress,
    SyncFlashcardQuizSessionProgressRequest
>

/**
 * Best-effort, fire-and-forget persistence of an in-progress "Hỏi nhanh" quiz
 * run — called after every card so the session can be resumed later within its
 * 24h TTL (`myInProgressFlashcardQuizSession`). Mirrors backend
 * `mutations/flashcard/sync-flashcard-quiz-session-progress`.
 */
export const mutateSyncFlashcardQuizSessionProgress = async ({
    mutation = MutationSyncFlashcardQuizSessionProgress.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncFlashcardQuizSessionProgressParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncFlashcardQuizSessionProgressResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
