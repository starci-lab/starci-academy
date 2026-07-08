import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    SyncFlashcardReviewSessionProgressRequest,
    MutateSyncFlashcardReviewSessionProgressResponse,
} from "./types/sync-flashcard-review-session-progress"

const mutation1 = gql`
  mutation SyncFlashcardReviewSessionProgress($request: SyncFlashcardReviewSessionProgressRequest!) {
    syncFlashcardReviewSessionProgress(request: $request) {
      success
      message
      error
      data {
        success
      }
    }
  }
`

export enum MutationSyncFlashcardReviewSessionProgress {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationSyncFlashcardReviewSessionProgress, DocumentNode> = {
    [MutationSyncFlashcardReviewSessionProgress.Mutation1]: mutation1,
}

/** Apollo params for {@link mutateSyncFlashcardReviewSessionProgress}. */
export type MutateSyncFlashcardReviewSessionProgressParams = MutateParams<
    MutationSyncFlashcardReviewSessionProgress,
    SyncFlashcardReviewSessionProgressRequest
>

/**
 * Best-effort, fire-and-forget persistence of an in-progress "Học thẻ" review
 * run — called after every graded card so the session can be resumed later
 * within its 24h TTL (`myInProgressFlashcardReviewSession`). Mirrors backend
 * `mutations/flashcard/sync-flashcard-review-session-progress`.
 */
export const mutateSyncFlashcardReviewSessionProgress = async ({
    mutation = MutationSyncFlashcardReviewSessionProgress.Mutation1,
    request,
    headers,
    debug,
    signal,
}: MutateSyncFlashcardReviewSessionProgressParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.mutate<MutateSyncFlashcardReviewSessionProgressResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
