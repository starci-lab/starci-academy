import useSWRMutation from "swr/mutation"
import { mutateCompleteFlashcardReviewSession } from "@/modules/api/graphql/mutations/mutation-complete-flashcard-review-session"
import { type CompleteFlashcardReviewSessionRequest } from "@/modules/api/graphql/mutations/types/complete-flashcard-review-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateCompleteFlashcardReviewSessionResult = Awaited<
    ReturnType<typeof mutateCompleteFlashcardReviewSession>
>

/** Argument for the completion mutation: the request plus the course header. */
interface CompleteFlashcardReviewSessionArg {
    /** The mutation request body. */
    request: CompleteFlashcardReviewSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateCompleteFlashcardReviewSession}.
 * Forwards the `X-Course-Id` header the enrollment guard reads.
 */
export const useMutateCompleteFlashcardReviewSessionSwr = () => {
    const swr = useSWRMutation<
        MutateCompleteFlashcardReviewSessionResult,
        Error,
        string,
        CompleteFlashcardReviewSessionArg
    >(
        "MUTATE_COMPLETE_FLASHCARD_REVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateCompleteFlashcardReviewSession({
                request: arg.request,
                headers: arg.headers,
            })
        }
    )
    return swr
}
