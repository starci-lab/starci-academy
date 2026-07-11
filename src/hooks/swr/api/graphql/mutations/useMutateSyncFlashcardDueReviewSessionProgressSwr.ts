import useSWRMutation from "swr/mutation"
import { mutateSyncFlashcardDueReviewSessionProgress } from "@/modules/api/graphql/mutations/mutation-sync-flashcard-due-review-session-progress"
import { type SyncFlashcardDueReviewSessionProgressRequest } from "@/modules/api/graphql/mutations/types/sync-flashcard-due-review-session-progress"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateSyncFlashcardDueReviewSessionProgressResult = Awaited<
    ReturnType<typeof mutateSyncFlashcardDueReviewSessionProgress>
>

/** Argument for the progress-sync mutation: the request plus the course header. */
interface SyncFlashcardDueReviewSessionProgressArg {
    /** The mutation request body. */
    request: SyncFlashcardDueReviewSessionProgressRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation for {@link mutateSyncFlashcardDueReviewSessionProgress}.
 * Best-effort, fire-and-forget persistence of the in-progress batch —
 * callers should NOT `await` this before advancing to the next card, and
 * should swallow errors (`.catch(() => {})`): a failed sync only degrades
 * resumability, it never blocks the live run.
 */
export const useMutateSyncFlashcardDueReviewSessionProgressSwr = () => {
    const swr = useSWRMutation<
        MutateSyncFlashcardDueReviewSessionProgressResult,
        Error,
        string,
        SyncFlashcardDueReviewSessionProgressArg
    >(
        "MUTATE_SYNC_FLASHCARD_DUE_REVIEW_SESSION_PROGRESS_SWR",
        async (_key, { arg }) => {
            return mutateSyncFlashcardDueReviewSessionProgress({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
