import useSWRMutation from "swr/mutation"
import { mutateSyncFlashcardReviewSessionProgress } from "@/modules/api/graphql/mutations/mutation-sync-flashcard-review-session-progress"
import { type SyncFlashcardReviewSessionProgressRequest } from "@/modules/api/graphql/mutations/types/sync-flashcard-review-session-progress"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateSyncFlashcardReviewSessionProgressResult = Awaited<
    ReturnType<typeof mutateSyncFlashcardReviewSessionProgress>
>

/** Argument for the progress-sync mutation: the request plus the course header. */
interface SyncFlashcardReviewSessionProgressArg {
    /** The mutation request body. */
    request: SyncFlashcardReviewSessionProgressRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation for {@link mutateSyncFlashcardReviewSessionProgress}.
 * Best-effort, fire-and-forget persistence of the in-progress run — callers
 * should NOT `await` this before advancing the reviewer, but must still route
 * failures through `runGraphQL` (`useGraphQLWithToast`, `{ showSuccessToast:
 * false }`) — NEVER a bare `.catch(() => {})` (thầy 2026-07-11: "fe không nuốt
 * lỗi, dùng runGraphQL đi"). A failed sync only degrades resumability, it
 * never blocks the live run — but the learner should still see the toast.
 */
export const useMutateSyncFlashcardReviewSessionProgressSwr = () => {
    const swr = useSWRMutation<
        MutateSyncFlashcardReviewSessionProgressResult,
        Error,
        string,
        SyncFlashcardReviewSessionProgressArg
    >(
        "MUTATE_SYNC_FLASHCARD_REVIEW_SESSION_PROGRESS_SWR",
        async (_key, { arg }) => {
            return mutateSyncFlashcardReviewSessionProgress({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
