import useSWRMutation from "swr/mutation"
import { mutateRenameContentAiSession } from "@/modules/api/graphql/mutations/mutation-rename-content-ai-session"
import { type RenameContentAiSessionRequest } from "@/modules/api/graphql/mutations/types/rename-content-ai-session"

type MutateRenameContentAiSessionResult = Awaited<ReturnType<typeof mutateRenameContentAiSession>>

/**
 * SWR mutation wrapper for {@link mutateRenameContentAiSession}.
 * Pass `{ sessionId, title }` as arg; a blank title resets the session to
 * auto-titling.
 */
export const useMutateRenameContentAiSessionSwr = () => {
    const swr = useSWRMutation<
        MutateRenameContentAiSessionResult,
        Error,
        string,
        RenameContentAiSessionRequest
    >(
        "MUTATE_RENAME_CONTENT_AI_SESSION_SWR",
        async (_key, { arg }) => {
            return mutateRenameContentAiSession({
                request: arg,
            })
        },
    )
    return swr
}
