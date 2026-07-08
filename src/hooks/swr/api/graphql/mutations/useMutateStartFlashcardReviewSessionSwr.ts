import useSWRMutation from "swr/mutation"
import { mutateStartFlashcardReviewSession } from "@/modules/api/graphql/mutations/mutation-start-flashcard-review-session"
import { type StartFlashcardReviewSessionRequest } from "@/modules/api/graphql/mutations/types/start-flashcard-review-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateStartFlashcardReviewSessionResult = Awaited<
    ReturnType<typeof mutateStartFlashcardReviewSession>
>

/** Argument for the start mutation: the request plus the course header. */
interface StartFlashcardReviewSessionArg {
    /** The mutation request body. */
    request: StartFlashcardReviewSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateStartFlashcardReviewSession}. Called
 * right after the deck's cards are fetched/sorted, before the reviewer opens
 * its first card, so the rest of the run (progress syncs, completion, resume)
 * shares this server-issued `sessionId`.
 */
export const useMutateStartFlashcardReviewSessionSwr = () => {
    const swr = useSWRMutation<
        MutateStartFlashcardReviewSessionResult,
        Error,
        string,
        StartFlashcardReviewSessionArg
    >(
        "MUTATE_START_FLASHCARD_REVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateStartFlashcardReviewSession({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
