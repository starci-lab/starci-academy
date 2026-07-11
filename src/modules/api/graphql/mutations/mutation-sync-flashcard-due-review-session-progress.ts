import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SyncFlashcardDueReviewSessionProgressRequest,
    MutateSyncFlashcardDueReviewSessionProgressResponse,
} from "./types/sync-flashcard-due-review-session-progress"

const mutation1 = gql`
  mutation SyncFlashcardDueReviewSessionProgress($request: SyncFlashcardDueReviewSessionProgressRequest!) {
    syncFlashcardDueReviewSessionProgress(request: $request) {
      success
      message
      error
      data {
        success
      }
    }
  }
`

export enum MutationSyncFlashcardDueReviewSessionProgress {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncFlashcardDueReviewSessionProgress, DocumentNode> = {
    [MutationSyncFlashcardDueReviewSessionProgress.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSyncFlashcardDueReviewSessionProgress}. */
export type MutateSyncFlashcardDueReviewSessionProgressParams = MutateParams<
    MutationSyncFlashcardDueReviewSessionProgress,
    SyncFlashcardDueReviewSessionProgressRequest
>

/**
 * Best-effort, fire-and-forget persistence of an in-progress cross-deck
 * DueReview batch — called after every graded card so the session can be
 * resumed later within its 24h TTL (`myInProgressFlashcardDueReviewSession`).
 * Mirrors backend `mutations/flashcard/sync-flashcard-due-review-session-progress`.
 */
export const mutateSyncFlashcardDueReviewSessionProgress = async ({
    mutation = MutationSyncFlashcardDueReviewSessionProgress.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncFlashcardDueReviewSessionProgressParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncFlashcardDueReviewSessionProgressResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
