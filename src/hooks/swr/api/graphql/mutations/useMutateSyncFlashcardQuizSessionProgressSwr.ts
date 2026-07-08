import useSWRMutation from "swr/mutation"
import { mutateSyncFlashcardQuizSessionProgress } from "@/modules/api/graphql/mutations/mutation-sync-flashcard-quiz-session-progress"
import { type SyncFlashcardQuizSessionProgressRequest } from "@/modules/api/graphql/mutations/types/sync-flashcard-quiz-session-progress"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateSyncFlashcardQuizSessionProgressResult = Awaited<
    ReturnType<typeof mutateSyncFlashcardQuizSessionProgress>
>

/** Argument for the progress-sync mutation: the request plus the course header. */
interface SyncFlashcardQuizSessionProgressArg {
    /** The mutation request body. */
    request: SyncFlashcardQuizSessionProgressRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation for {@link mutateSyncFlashcardQuizSessionProgress}. Best-effort,
 * fire-and-forget persistence of the in-progress run — callers should NOT
 * `await` this before advancing the quiz, and should swallow errors
 * (`.catch(() => {})`): a failed sync only degrades resumability, it never
 * blocks the live run.
 */
export const useMutateSyncFlashcardQuizSessionProgressSwr = () => {
    const swr = useSWRMutation<
        MutateSyncFlashcardQuizSessionProgressResult,
        Error,
        string,
        SyncFlashcardQuizSessionProgressArg
    >(
        "MUTATE_SYNC_FLASHCARD_QUIZ_SESSION_PROGRESS_SWR",
        async (_key, { arg }) => {
            return mutateSyncFlashcardQuizSessionProgress({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
