import useSWRMutation from "swr/mutation"
import { mutateCompleteFlashcardDueReviewSession } from "@/modules/api/graphql/mutations/mutation-complete-flashcard-due-review-session"
import { type CompleteFlashcardDueReviewSessionRequest } from "@/modules/api/graphql/mutations/types/complete-flashcard-due-review-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateCompleteFlashcardDueReviewSessionResult = Awaited<
    ReturnType<typeof mutateCompleteFlashcardDueReviewSession>
>

/** Argument for the completion mutation: the request plus the course header. */
interface CompleteFlashcardDueReviewSessionArg {
    /** The mutation request body. */
    request: CompleteFlashcardDueReviewSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateCompleteFlashcardDueReviewSession}
 * (Bearer from Keycloak). Forwards the `X-Course-Id` header the enrollment
 * guard reads.
 */
export const useMutateCompleteFlashcardDueReviewSessionSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCompleteFlashcardDueReviewSessionResult,
        Error,
        string,
        CompleteFlashcardDueReviewSessionArg
    >(
        "MUTATE_COMPLETE_FLASHCARD_DUE_REVIEW_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateCompleteFlashcardDueReviewSession({
                request: arg.request,
                headers: arg.headers,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
