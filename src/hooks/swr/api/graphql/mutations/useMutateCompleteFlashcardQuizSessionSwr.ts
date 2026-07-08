import useSWRMutation from "swr/mutation"
import { mutateCompleteFlashcardQuizSession } from "@/modules/api/graphql/mutations/mutation-complete-flashcard-quiz-session"
import { type CompleteFlashcardQuizSessionRequest } from "@/modules/api/graphql/mutations/types/complete-flashcard-quiz-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateCompleteFlashcardQuizSessionResult = Awaited<
    ReturnType<typeof mutateCompleteFlashcardQuizSession>
>

/** Argument for the completion mutation: the request plus the course header. */
interface CompleteFlashcardQuizSessionArg {
    /** The mutation request body. */
    request: CompleteFlashcardQuizSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateCompleteFlashcardQuizSession} (Bearer from
 * Keycloak). Forwards the `X-Course-Id` header the enrollment guard reads.
 */
export const useMutateCompleteFlashcardQuizSessionSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCompleteFlashcardQuizSessionResult,
        Error,
        string,
        CompleteFlashcardQuizSessionArg
    >(
        "MUTATE_COMPLETE_FLASHCARD_QUIZ_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateCompleteFlashcardQuizSession({
                request: arg.request,
                headers: arg.headers,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
