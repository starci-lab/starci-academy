import useSWRMutation from "swr/mutation"
import { mutateStartFlashcardDueReviewSession } from "@/modules/api/graphql/mutations/mutation-start-flashcard-due-review-session"
import { type StartFlashcardDueReviewSessionRequest } from "@/modules/api/graphql/mutations/types/start-flashcard-due-review-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateStartFlashcardDueReviewSessionResult = Awaited<
    ReturnType<typeof mutateStartFlashcardDueReviewSession>
>

/** Argument for the start mutation: the request plus the course header. */
interface StartFlashcardDueReviewSessionArg {
    /** The mutation request body. */
    request: StartFlashcardDueReviewSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateStartFlashcardDueReviewSession}.
 * Called right after the due batch is drawn, before card 1 is shown, so the
 * rest of the run (progress syncs, completion, resume) shares this
 * server-issued `sessionId`. Mirrors `useMutateStartFlashcardQuizSessionSwr`.
 */
export const useMutateStartFlashcardDueReviewSessionSwr = () => {
    const swr = useSWRMutation<
        MutateStartFlashcardDueReviewSessionResult,
        Error,
        string,
        StartFlashcardDueReviewSessionArg
    >(
        "MUTATE_START_FLASHCARD_DUE_REVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateStartFlashcardDueReviewSession({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
