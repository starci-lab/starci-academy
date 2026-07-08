import useSWRMutation from "swr/mutation"
import { mutateStartFlashcardQuizSession } from "@/modules/api/graphql/mutations/mutation-start-flashcard-quiz-session"
import { type StartFlashcardQuizSessionRequest } from "@/modules/api/graphql/mutations/types/start-flashcard-quiz-session"
import type { GraphQLHeaders } from "@/modules/api/graphql/types"

type MutateStartFlashcardQuizSessionResult = Awaited<
    ReturnType<typeof mutateStartFlashcardQuizSession>
>

/** Argument for the start mutation: the request plus the course header. */
interface StartFlashcardQuizSessionArg {
    /** The mutation request body. */
    request: StartFlashcardQuizSessionRequest
    /** Course header for the enrollment guard (`X-Course-Id`). */
    headers: GraphQLHeaders
}

/**
 * SWR mutation wrapper for {@link mutateStartFlashcardQuizSession}. Called
 * right after `sessionCards` is drawn, before question 1 is shown, so the
 * rest of the run (progress syncs, completion, resume) shares this
 * server-issued `sessionId` instead of a client-generated uuid.
 */
export const useMutateStartFlashcardQuizSessionSwr = () => {
    const swr = useSWRMutation<
        MutateStartFlashcardQuizSessionResult,
        Error,
        string,
        StartFlashcardQuizSessionArg
    >(
        "MUTATE_START_FLASHCARD_QUIZ_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateStartFlashcardQuizSession({
                request: arg.request,
                headers: arg.headers,
            })
        },
    )
    return swr
}
